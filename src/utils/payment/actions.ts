'use server';

import { adminSDK } from '@/utils/firebase/adminConfig';
import { bookingsCollection, bookingSummary, markPaid, paypalFetch } from './paypalServer';

async function getOwnUnpaidBooking(idToken: string, bookingId: string) {
  const { uid } = await adminSDK.auth().verifyIdToken(idToken);
  const ref = bookingsCollection().doc(String(bookingId));
  const booking = (await ref.get()).data();
  if (!booking || booking.uid !== uid) throw new Error('Booking not found');
  if (booking.isPaid) throw new Error('Booking is already paid');
  return { ref, booking };
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
