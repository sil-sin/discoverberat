'use server';

import { adminSDK } from '@/utils/firebase/adminConfig';
import { sendMail } from '@/utils/mail';
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
  const tour = `${booking.title} on ${date} for ${booking.guestNumber} guests`;
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
      `Booking cancelled: ${booking.title} on ${date}`,
      booking.isPaid
        ? `Dear ${booking.booker},\n\nWe received your cancellation of ${tour}. We will refund your payment minus the PayPal fee within a few business days.\n\nDiscover Berat`
        : `Dear ${booking.booker},\n\nYour booking of ${tour} is cancelled.\n\nDiscover Berat`,
    ),
    sendMail(
      process.env.NEXT_PUBLIC_ADMIN,
      `${booking.isPaid ? 'Refund needed' : 'Booking cancelled'}: ${booking.booker} on ${date}`,
      booking.isPaid
        ? `${booking.booker} cancelled ${tour}. Refund PayPal transaction ${booking.paypalCaptureId} (booking ID ${ref.id}) in PayPal. The booking is removed when the refund goes through.`
        : `${booking.booker} cancelled ${tour}. Booking ID: ${ref.id}. Phone: ${booking.phone ?? '-'}`,
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
