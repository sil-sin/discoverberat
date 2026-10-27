import Button from '@/components/simple/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions - Discover Berat',
  description: 'Terms and Conditions for Discover Berat bookings.',
};

export default function TermsPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Terms and Conditions</h1>
      <p>Last updated: 27 October 2026</p>
      {/* TODO: add legal business name, address and tax ID (NIPT) */}
      <p>
        These terms apply when you use this website and book a tour with
        Discover Berat. By booking a tour, you accept these terms.
      </p>

      <h2>Bookings</h2>
      <ul>
        <li>You need an account to book a tour.</li>
        <li>A booking is for at least 2 guests.</li>
        <li>
          Give a correct name, email address, phone number and pickup location. We use them to
          contact you and to pick you up.
        </li>
        <li>
          Your booking is confirmed when you receive our confirmation email.
        </li>
      </ul>

      <h2>Prices and Payment</h2>
      <ul>
        <li>
          Prices are in euros (€) per guest. The total price is the price per
          guest multiplied by the number of guests.
        </li>
        <li>
          You can pay online with PayPal, or pay on location on the day of the
          tour.
        </li>
        <li>We send a receipt by email after an online payment.</li>
      </ul>

      {/* TODO: add what happens when we cancel a tour (weather, too few guests, guide unavailable) */}
      <h2>Cancellations and Refunds</h2>
      <p>
        For cancellations and refunds, see our{' '}
        <Button variant="link" href="/refund-policy">
          Refund Policy
        </Button>
        .
      </p>

      <h2>Your Account</h2>
      <p>
        Keep your sign-in details secret. You are responsible for bookings made
        with your account.
      </p>

      <h2>Your Data</h2>
      <p>
        For how we handle your personal data, see our{' '}
        <Button variant="link" href="/privacy-policy">
          Privacy Policy
        </Button>
        .
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        If we change these terms, we post the new version on this page and
        update the date at the top. The terms that applied when you booked stay
        valid for that booking.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these terms, contact us at{' '}
        <strong>discoverberat@gmail.com</strong>.
      </p>
    </div>
  );
}
