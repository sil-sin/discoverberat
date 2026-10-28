import type { DocumentData, DocumentReference } from 'firebase-admin/firestore';
import { adminSDK } from '@/utils/firebase/adminConfig';
import { sendMail } from '@/utils/mail';

// Not a 'use server' file on purpose: exports here must never become client-callable actions.

const PAYPAL_API =
  process.env.VERCEL_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

export async function paypalFetch(path: string, body?: object | string) {
  const credentials = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString('base64');
  const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}` },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });
  if (!tokenRes.ok) {
    console.error('PayPal auth failed:', tokenRes.status, await tokenRes.text());
    throw new Error('PayPal auth failed');
  }
  const { access_token } = await tokenRes.json();

  const res = await fetch(`${PAYPAL_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: typeof body === 'string' ? body : body && JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('PayPal request failed:', path, data);
    throw new Error('PayPal request failed');
  }
  return data;
}

export const CANCEL_DEADLINE_MS = 24 * 60 * 60 * 1000;

export const bookingsCollection = () => adminSDK.firestore().collection('bookings');

export function bookingSummary(booking: DocumentData) {
  // Prices come from Contentful as '€' amounts; PayPal needs an ISO code.
  if (booking.currency !== '€') throw new Error('Unsupported currency');
  // Work in cents so unit price × guests matches the total exactly, as PayPal requires.
  const unitCents = Math.round(booking.price * 100);
  return {
    unitAmount: (unitCents / 100).toFixed(2),
    amount: ((unitCents * booking.guestNumber) / 100).toFixed(2),
    date: formatBookingDate(booking),
  };
}

export const formatBookingDate = (booking: DocumentData) =>
  booking.date.toDate().toLocaleString('en-GB', {
    timeZone: 'Europe/Tirane',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

// Deletes the booking and frees its day slot; bookings made before dateKey was stored keep their slot.
export async function releaseBooking(ref: DocumentReference, booking: DocumentData) {
  const db = adminSDK.firestore();
  await db.runTransaction(async (tx) => {
    const dayLock = booking.dateKey
      ? (
          await tx.get(
            db
              .collection('unavailableDates')
              .where('uid', '==', booking.uid)
              .where('date', '==', booking.dateKey)
              .limit(1),
          )
        ).docs[0]
      : undefined;
    tx.delete(ref);
    if (dayLock) tx.delete(dayLock.ref);
  });
}

type Capture = {
  id: string;
  status?: string;
  amount?: { currency_code?: string; value?: string };
};

// Called by both the capture action and the webhook; the transaction makes sure only one of them sends the receipt.
export async function markPaid(bookingId: string, capture: Capture | undefined) {
  const ref = bookingsCollection().doc(bookingId);
  const booking = await adminSDK.firestore().runTransaction(async (tx) => {
    const data = (await tx.get(ref)).data();
    if (!data) throw new Error('Booking not found');
    if (data.isPaid) return null;
    if (
      !capture ||
      capture.status !== 'COMPLETED' ||
      capture.amount?.currency_code !== 'EUR' ||
      capture.amount?.value !== bookingSummary(data).amount
    ) {
      console.error('PayPal capture not completed:', bookingId, capture?.id, capture?.status);
      throw new Error('Payment was not completed');
    }
    tx.update(ref, { isPaid: true, paypalCaptureId: capture.id });
    return data;
  });
  if (booking && capture) await sendReceipt(bookingId, booking, capture.id);
}

async function sendReceipt(bookingId: string, booking: DocumentData, captureId: string) {
  const { unitAmount, amount, date } = bookingSummary(booking);
  const details = `Tour: ${booking.title}\nDate: ${date}\nGuests: ${booking.guestNumber}\nPrice per person: €${unitAmount}\nTotal paid: €${amount}\nBooking ID: ${bookingId}\nPayPal transaction ID: ${captureId}`;
  // The payment is already captured, so a failed email must not fail the request.
  const results = await Promise.allSettled([
    sendMail(
      booking.email,
      `Payment receipt: ${booking.title} on ${date}`,
      `Dear ${booking.booker},\n\nWe received your payment. Here are your booking details:\n\n${details}\n\nSee you soon!\nDiscover Berat`,
    ),
    sendMail(
      process.env.NEXT_PUBLIC_ADMIN,
      `Payment received: €${amount} from ${booking.booker}`,
      details,
    ),
  ]);
  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error(`Booking ${bookingId} receipt email failed:`, result.reason);
    }
  });
}
