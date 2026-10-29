import { getEntriesByType, getEntry } from '@/utils/contentful/contentful';
import { getFirestore as getFirestoreAdmin } from 'firebase-admin/firestore';
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

const MAX_BOOKINGS_PER_DAY = 3;
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
  if (!/^\d{2}\/\d{2}\/\d{4}, 00:00:00$/.test(dateKey)) {
    throw new Error('Invalid booking date');
  }
  const [day, month, year] = dateKey.slice(0, 10).split('/').map(Number);
  const date = new Date(input.date);
  const dayStart = Date.UTC(year, month - 1, day);
  const offset = date.getTime() - dayStart;
  // dateKey is the booker's local day, so allow every UTC offset (-12h to +14h) around it.
  if (!(date > new Date()) || offset < -14 * HOUR || offset >= 36 * HOUR) {
    throw new Error('Invalid booking date');
  }
  const guestNumber = Number(input.guestNumber);
  if (!Number.isInteger(guestNumber) || guestNumber < 2) {
    throw new Error('Invalid guest number');
  }
  const phone = String(input.phone ?? '').trim();
  if (!/^(?=(?:\D*\d){7})\+?[\d\s()-]{7,20}$/.test(phone)) {
    throw new Error('Invalid phone number');
  }
  const entry: any = await getEntry(String(input.bookingId));
  const type = BOOKING_TYPES[entry.sys.contentType.sys.id];
  if (!type) throw new Error('Invalid booking item');

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
    uid,
  };
  const db = getFirestoreAdmin();

  const bookingId = await db.runTransaction(async (tx) => {
    // Every booking for a day writes this doc, so concurrent bookings conflict and retry instead of overbooking.
    const dayLock = db
      .collection('bookingDayLocks')
      .doc(encodeURIComponent(dateKey));
    await tx.get(dayLock);
    const taken = await tx.get(
      db.collection('unavailableDates').where('date', '==', dateKey),
    );
    if (taken.size >= MAX_BOOKINGS_PER_DAY) return null;

    const bookingRef = db.collection('bookings').doc();
    tx.set(dayLock, { updatedAt: new Date() });
    tx.create(bookingRef, booking);
    tx.create(db.collection('unavailableDates').doc(), {
      uid,
      date: dateKey,
      day: new Date(dayStart),
    });
    return bookingRef.id;
  });
  if (!bookingId) return null;

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
  return bookingId;
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

  const db = getFirestoreAdmin();
  const unavailableDates = await db
    .collection('unavailableDates')
    .where('day', '>=', new Date(Date.now() - 48 * HOUR))
    .get();

  const dateCountMap = new Map();
  unavailableDates.docs.forEach((doc) => {
    const date = doc.data().date;
    if (dateCountMap.has(date)) {
      dateCountMap.set(date, dateCountMap.get(date) + 1);
    } else {
      dateCountMap.set(date, 1);
    }
  });

  const datesWithMoreThanTwoOccurrences = Array.from(dateCountMap.entries())
    .filter(([, count]) => count >= MAX_BOOKINGS_PER_DAY)
    .map(([date]) => date);

  if (serviceData) {
    return {
      booking: {
        ...serviceData.fields,
        id: serviceData.sys.id,
        type: 'service',
      },
      unavailableDates: datesWithMoreThanTwoOccurrences,
    };
  }

  if (tourData) {
    return {
      booking: { ...tourData.fields, id: tourData.sys.id, type: 'tour' },
      unavailableDates: datesWithMoreThanTwoOccurrences,
    };
  }

  return { booking: null, unavailableDates: [] };
}

export default async function BookingNewPage({ searchParams }: Props) {
  const { tour, service } = await searchParams;
  const { booking, unavailableDates } = await getBookingData(tour, service);

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
      unavailableDates={unavailableDates}
      createBooking={createBooking}
    />
  );
}
