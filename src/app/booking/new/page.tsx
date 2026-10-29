import { getEntriesByType, getEntry } from '@/utils/contentful/contentful';
import { FieldValue, getFirestore as getFirestoreAdmin } from 'firebase-admin/firestore';
import {
  DATE_KEY_PATTERN,
  MAX_GUESTS_PER_SLOT,
  MIN_GUESTS,
  getStartTimes,
  tiraneDateTime,
} from '@/helpers/booking';
import { adminSDK } from '@/utils/firebase/adminConfig';

import type { Metadata } from 'next';
import { sendMail } from '@/utils/mail';
import { formatTourDate, renderEmail } from '@/utils/emailTemplate';
import { SITE_URL } from '@/utils/site';
import { BookingClient } from './BookingClient';

export const metadata: Metadata = {
  title: 'New Booking - Discover Berat',
  description: 'Book your tour or service with Discover Berat.',
};

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ tour?: string; service?: string }>;
};

const HOUR = 60 * 60 * 1000;
const BOOKING_TYPES: Record<string, string> = {
  tourPage: 'tour',
  serviceCard: 'service',
};

async function createBooking(
  idToken: string,
  dateKey: string,
  input: Record<string, any>,
) {
  'use server';
  const { uid, email } = await adminSDK.auth().verifyIdToken(idToken);
  if (!DATE_KEY_PATTERN.test(dateKey)) {
    throw new Error('Invalid booking date');
  }
  const guestNumber = Number(input.guestNumber);
  if (!Number.isInteger(guestNumber) || guestNumber < MIN_GUESTS) {
    throw new Error('Invalid guest number');
  }
  const phone = String(input.phone ?? '').trim();
  if (!/^(?=(?:\D*\d){7})\+?[\d\s()-]{7,20}$/.test(phone)) {
    throw new Error('Invalid phone number');
  }
  const entry: any = await getEntry(String(input.bookingId));
  const type = BOOKING_TYPES[entry.sys.contentType.sys.id];
  if (!type) throw new Error('Invalid booking item');

  const time = String(input.time);
  if (!getStartTimes(entry.fields).includes(time)) {
    throw new Error('Invalid start time');
  }
  // The start is built here from the picked day and time, so it always matches the slot it is counted in.
  const date = tiraneDateTime(dateKey, time);
  if (!(date > new Date())) throw new Error('Invalid booking date');
  const slotId = encodeURIComponent(`${entry.sys.id}_${dateKey}_${time}`);

  const { title, price, currency = '€' } = entry.fields;
  const booker = String(input.booker);
  const booking = {
    type,
    title,
    price,
    currency,
    isPaid: false,
    bookingId: entry.sys.id,
    booker,
    email: String(input.email),
    phone,
    pickup: String(input.pickup),
    isPrivate: Boolean(input.isPrivate),
    guestNumber,
    date,
    dateKey,
    slotId,
    uid,
  };
  const db = getFirestoreAdmin();

  const result = await db.runTransaction(async (tx) => {
    // Every booking for a slot writes its counter doc, so concurrent bookings conflict and retry instead of overbooking.
    const slotRef = db.collection('bookingSlots').doc(slotId);
    const [blocked, slot] = await Promise.all([
      tx.get(db.collection('blockedDates').doc(encodeURIComponent(dateKey))),
      tx.get(slotRef),
    ]);
    if (blocked.exists) {
      return { error: 'This date is not available. Pick another date.' };
    }
    const seatsLeft = MAX_GUESTS_PER_SLOT - (slot.data()?.guests ?? 0);
    if (guestNumber > seatsLeft) {
      return {
        error:
          seatsLeft < MIN_GUESTS
            ? 'This time is fully booked. Pick another time or date.'
            : `Only ${seatsLeft} places are left at this time.`,
      };
    }

    const bookingRef = db.collection('bookings').doc();
    tx.create(bookingRef, booking);
    tx.set(slotRef, {
      tourId: entry.sys.id,
      dateKey,
      time,
      day: date,
      guests: FieldValue.increment(guestNumber),
    }, { merge: true });
    return { bookingId: bookingRef.id };
  });
  if (!result.bookingId) return result;
  const { bookingId } = result;

  const when = formatTourDate(date);
  const total = `${currency}${price * guestNumber}`;
  const details: [string, string][] = [
    ['Tour', title],
    ['Date', when],
    ['Guests', String(guestNumber)],
    ['Pickup', booking.pickup],
    ['Total', `${total} (${currency}${price} per person)`],
    ['Booking ID', bookingId],
  ];

  // The booking is already saved, so a failed email must not fail the request.
  const results = await Promise.allSettled([
    sendMail(
      email,
      `Booking confirmed: ${title}, ${when}`,
      renderEmail({
        heading: 'Your booking is confirmed',
        intro: `Hi ${booker}, thank you for booking with Discover Berat. Here are your booking details.`,
        details,
        sections: [
          {
            title: 'Payment',
            text: `Pay ${total} online with PayPal from your booking page, or pay on the day of the tour.`,
          },
          {
            title: 'Cancellation',
            text: 'You can cancel for free up to 24 hours before the tour on your profile page. PayPal refunds exclude the PayPal fee.',
          },
          {
            title: 'Questions?',
            text: 'Reply to this email or message us on WhatsApp. See you in Berat!',
          },
        ],
        cta: {
          label: 'View your booking',
          href: `${SITE_URL}/booking/new/thank-you?id=${bookingId}`,
        },
      }),
    ),
    sendMail(
      process.env.NEXT_PUBLIC_ADMIN,
      `New booking: ${title}, ${when}, ${guestNumber} guests`,
      renderEmail({
        heading: 'New booking',
        intro: `${booker} booked ${title}. The booking is not paid yet.`,
        details: [
          ...details,
          ['Name', booker],
          ['Email', booking.email],
          ['Phone', phone],
        ],
      }),
    ),
  ]);
  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error(`Booking ${bookingId} email failed:`, result.reason);
    }
  });
  return { bookingId };
}

async function getBookingData(tourSlug?: string, serviceSlug?: string) {
  const tourData: any = tourSlug
    ? (await getEntriesByType('tourPage', { 'fields.url': tourSlug, limit: 1 }))[0]
    : null;

  const serviceData: any = serviceSlug
    ? (
        await getEntriesByType('serviceCard', {
          'fields.url': serviceSlug,
          limit: 1,
        })
      )[0]
    : null;

  const entry = serviceData ?? tourData;
  if (!entry) return { booking: null, blockedDates: [], seatsLeft: {} };

  const db = getFirestoreAdmin();
  const since = new Date(Date.now() - 48 * HOUR);
  const [blocked, slots] = await Promise.all([
    db.collection('blockedDates').where('day', '>=', since).get(),
    db.collection('bookingSlots').where('tourId', '==', entry.sys.id).get(),
  ]);
  const seatsLeft: Record<string, number> = {};
  slots.docs.forEach((doc) => {
    const { dateKey, time, day, guests } = doc.data();
    if (day.toDate() >= since) {
      seatsLeft[`${dateKey} ${time}`] = MAX_GUESTS_PER_SLOT - guests;
    }
  });

  return {
    booking: {
      ...entry.fields,
      id: entry.sys.id,
      type: serviceData ? 'service' : 'tour',
    },
    blockedDates: blocked.docs.map((doc) => doc.data().dateKey as string),
    seatsLeft,
  };
}

export default async function BookingNewPage({ searchParams }: Props) {
  const { tour, service } = await searchParams;
  const { booking, blockedDates, seatsLeft } = await getBookingData(tour, service);

  if (!booking) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Booking not found</h1>
        <p>Please select a tour or service to book.</p>
      </div>
    );
  }

  return (
    <BookingClient
      booking={booking}
      blockedDates={blockedDates}
      seatsLeft={seatsLeft}
      createBooking={createBooking}
    />
  );
}
