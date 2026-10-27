import { bookingsCollection, markPaid, paypalFetch } from '@/utils/payment/paypalServer';

export async function POST(request: Request) {
  const event = await request.json();
  const header = (name: string) => request.headers.get(name);
  const { verification_status } = await paypalFetch(
    '/v1/notifications/verify-webhook-signature',
    {
      auth_algo: header('paypal-auth-algo'),
      cert_url: header('paypal-cert-url'),
      transmission_id: header('paypal-transmission-id'),
      transmission_sig: header('paypal-transmission-sig'),
      transmission_time: header('paypal-transmission-time'),
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: event,
    },
  );
  if (verification_status !== 'SUCCESS') {
    return new Response('Invalid signature', { status: 400 });
  }

  const { event_type, resource } = event;
  const bookingId = resource?.custom_id ?? resource?.invoice_id;
  if (!bookingId) return new Response(null, { status: 200 });

  if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    await markPaid(bookingId, resource);
  }

  if (
    event_type === 'PAYMENT.CAPTURE.REFUNDED' ||
    event_type === 'PAYMENT.CAPTURE.REVERSED'
  ) {
    // Refunds exclude the PayPal fee, so they are always partial; any refund means a cancellation.
    const ref = bookingsCollection().doc(bookingId);
    if ((await ref.get()).exists) await ref.update({ isPaid: false });
  }

  return new Response(null, { status: 200 });
}
