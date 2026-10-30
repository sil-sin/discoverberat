import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy - Discover Berat',
  description: 'Refund Policy for Discover Berat bookings.',
  alternates: { canonical: '/refund-policy' },
};

export default function RefundPolicyPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Refund Policy</h1>
      <p>
        You can pay for your booking online with PayPal or on location. This
        policy applies to bookings paid online.
      </p>

      <h2>Refunds</h2>
      <p>
        You can cancel for free until 24 hours before the tour starts. We
        refund the amount you paid minus the PayPal processing fee. PayPal
        keeps this fee when a payment is refunded, so we cannot return it.
      </p>
      <p>Cancellations less than 24 hours before the tour are not refunded.</p>
      <p>
        Refunds go back to the PayPal account or card you paid with. PayPal
        usually processes them within a few business days.
      </p>

      <h2>How to Cancel</h2>
      <p>
        Cancel a booking on your profile page with the &quot;Cancel
        booking&quot; button. Less than 24 hours before the tour, contact us via
        email at <strong>discoverberat@gmail.com</strong> with your booking ID.
        You can find the booking ID in your booking confirmation email.
      </p>
    </div>
  );
}
