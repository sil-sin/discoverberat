'use server';

import { adminSDK } from '@/utils/firebase/adminConfig';
import { sendMail } from '@/utils/mail';
import { formatTourDate, renderEmail } from '@/utils/emailTemplate';
import { SITE_URL } from '@/utils/site';
import {
  bookingsCollection,
  CANCEL_DEADLINE_MS,
  bookingSummary,
  formatBookingDate,
  markPaid,
  paypalFetch,
  releaseBooking,
} from './paypalServer';

async function getOwnBooking(idToken: string, bookingId: string) {
  const { uid } = await adminSDK.auth().verifyIdToken(idToken);
  const ref = bookingsCollection().doc(String(bookingId));
  const booking = (await ref.get()).data();
  if (!booking || booking.uid !== uid) throw new Error('Booking not found');
  return { ref, booking };
}

async function getOwnUnpaidBooking(idToken: string, bookingId: string) {
  const own = await getOwnBooking(idToken, bookingId);
  if (own.booking.isPaid) throw new Error('Booking is already paid');
  return own;
}

export async function cancelBooking(idToken: string, bookingId: string) {
  const { ref, booking } = await getOwnBooking(idToken, bookingId);
  if (booking.date.toDate().getTime() - Date.now() < CANCEL_DEADLINE_MS) {
    return {
      error:
        'Bookings can be cancelled only until 24 hours before the tour. Please contact us.',
    };
  }
  if (booking.cancellationRequested) return { error: null };

  const date = formatBookingDate(booking);
  const details: [string, string][] = [
    ['Tour', booking.title],
    ['Date', formatTourDate(booking.date.toDate())],
    ['Guests', String(booking.guestNumber)],
    ['Booking ID', ref.id],
  ];
  // Paid bookings wait for a manual PayPal refund; the refund webhook then releases them.
  if (booking.isPaid) {
    await ref.update({ cancellationRequested: true });
  } else {
    await releaseBooking(ref, booking);
  }

  // The cancellation is already saved, so a failed email must not fail the request.
  const results = await Promise.allSettled([
    sendMail(
      booking.email,
      `Booking cancelled: ${booking.title}, ${date}`,
      renderEmail({
        heading: 'Your booking is cancelled',
        intro: `Hi ${booking.booker}, we received your cancellation. Here is the booking you cancelled.`,
        details,
        sections: [
          booking.isPaid
            ? {
                title: 'Your refund',
                text: 'We refund your payment to your PayPal account or card within a few business days. PayPal keeps its processing fee, so the refund is the amount you paid minus that fee.',
              }
            : {
                title: 'Nothing to pay',
                text: 'You did not pay for this booking, so there is nothing to refund.',
              },
          {
            title: 'Changed your mind?',
            text: 'You are welcome to book again any time. Questions? Reply to this email or message us on WhatsApp.',
          },
        ],
        cta: { label: 'Browse tours', href: `${SITE_URL}/tours` },
      }),
    ),
    sendMail(
      process.env.NEXT_PUBLIC_ADMIN,
      `${booking.isPaid ? 'Refund needed' : 'Booking cancelled'}: ${booking.booker}, ${date}`,
      renderEmail({
        heading: booking.isPaid ? 'Refund needed' : 'Booking cancelled',
        intro: booking.isPaid
          ? `${booking.booker} cancelled a paid booking. In PayPal, refund the refund amount below (paid minus the PayPal fee), not the full amount. The booking is removed when the refund goes through.`
          : `${booking.booker} cancelled an unpaid booking. The date is free again.`,
        details: [
          ...details,
          ['Phone', booking.phone ?? '-'],
          ...(booking.isPaid
            ? [
                ['PayPal transaction', booking.paypalCaptureId],
                ['Refund amount', booking.paypalNetAmount ? `€${booking.paypalNetAmount}` : 'See PayPal'],
              ] as [string, string][]
            : []),
        ],
      }),
    ),
  ]);
  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error(`Booking ${ref.id} cancellation email failed:`, result.reason);
    }
  });
  return { error: null };
}

export async function createPayPalOrder(idToken: string, bookingId: string) {
  const { ref, booking } = await getOwnUnpaidBooking(idToken, bookingId);
  const { unitAmount, amount, date } = bookingSummary(booking);
  const order = await paypalFetch('/v2/checkout/orders', {
    intent: 'CAPTURE',
    purchase_units: [
      {
        custom_id: ref.id,
        invoice_id: ref.id,
        description: `${booking.title} – ${date}`.slice(0, 127),
        soft_descriptor: 'DISCOVERBERAT',
        amount: {
          currency_code: 'EUR',
          value: amount,
          breakdown: { item_total: { currency_code: 'EUR', value: amount } },
        },
        items: [
          {
            name: booking.title.slice(0, 127),
            description: date,
            quantity: String(booking.guestNumber),
            unit_amount: { currency_code: 'EUR', value: unitAmount },
          },
        ],
      },
    ],
  });
  // Capture only accepts this order id, so one payment can never pay another booking.
  await ref.update({ paypalOrderId: order.id });
  return order.id as string;
}

export async function capturePayPalOrder(
  idToken: string,
  bookingId: string,
  orderId: string,
) {
  const { ref, booking } = await getOwnUnpaidBooking(idToken, bookingId);
  if (booking.paypalOrderId !== orderId) throw new Error('Order mismatch');

  const result = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`);
  await markPaid(ref.id, result.purchase_units?.[0]?.payments?.captures?.[0]);
}
