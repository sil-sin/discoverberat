import { bookingsCollection, markPaid, paypalFetch, releaseBooking } from '@/lib/payment/paypal-server';
import { sendMail } from '@/lib/mail';
import { renderEmail } from '@/lib/email-template';

export async function POST(request: Request) {
  const rawEvent = await request.text();
  const event = JSON.parse(rawEvent);
  const header = (name: string) => request.headers.get(name);
  const fields = JSON.stringify({
    auth_algo: header('paypal-auth-algo'),
    cert_url: header('paypal-cert-url'),
    transmission_id: header('paypal-transmission-id'),
    transmission_sig: header('paypal-transmission-sig'),
    transmission_time: header('paypal-transmission-time'),
    webhook_id: process.env.PAYPAL_WEBHOOK_ID,
  });
  // The signature covers PayPal's exact bytes, so send the raw event instead of re-serializing it.
  const { verification_status } = await paypalFetch(
    '/v1/notifications/verify-webhook-signature',
    `${fields.slice(0, -1)},"webhook_event":${rawEvent}}`,
  );
  if (verification_status !== 'SUCCESS') {
    return new Response('Invalid signature', { status: 400 });
  }

  const { event_type, resource } = event;
  const bookingId = resource?.custom_id ?? resource?.invoice_id;
  if (!bookingId) return new Response(null, { status: 200 });

  if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    // A 5xx would make PayPal retry forever, so unmatched captures go to the admin for a refund instead.
    await markPaid(bookingId, resource).catch(async (error) => {
      console.error('Webhook capture not matched:', bookingId, resource?.id, error);
      await sendMail(
        process.env.ADMIN_EMAIL,
        `Check PayPal capture ${resource?.id}`,
        renderEmail({
          heading: 'Payment needs a check',
          intro: 'A PayPal payment came in, but it could not be matched to a booking. Check it in PayPal and refund it if needed.',
          details: [
            ['PayPal transaction', String(resource?.id)],
            ['Booking ID', bookingId],
          ],
        }),
      ).catch(() => {});
    });
  }

  if (
    event_type === 'PAYMENT.CAPTURE.REFUNDED' ||
    event_type === 'PAYMENT.CAPTURE.REVERSED'
  ) {
    // Refunds exclude the PayPal fee, so they are always partial; any refund means a cancellation.
    const ref = bookingsCollection().doc(bookingId);
    const booking = (await ref.get()).data();
    if (booking?.cancellationRequested) await releaseBooking(ref);
    else if (booking) await ref.update({ isPaid: false });
  }

  return new Response(null, { status: 200 });
}
