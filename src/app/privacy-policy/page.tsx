import Button from '@/components/simple/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Discover Berat',
  description: 'Privacy Policy for Discover Berat website.',
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Privacy Policy</h1>
      <p>Last updated: 27 October 2026</p>
      {/* TODO: add legal business name, address and tax ID (NIPT) */}
      <p>
        This policy explains which personal data Discover Berat collects, why we
        collect it, who receives it and what rights you have. Discover Berat is
        responsible for your data. You can contact us at{' '}
        <strong>discoverberat@gmail.com</strong>.
      </p>

      <h2>Data We Collect</h2>
      <ul>
        <li>
          <strong>Account:</strong> when you sign up with email, we store your
          first name, last name and email address. Your password is handled by
          Firebase Authentication. We never see it. When you sign in with
          Google, we receive your name, email address and profile photo from
          Google.
        </li>
        <li>
          <strong>Bookings:</strong> the booker name, email address, phone number, pickup
          location, number of guests, tour, date, and whether the booking is
          paid.
        </li>
        <li>
          <strong>Payments:</strong> when you pay online, PayPal processes your
          payment. We store only the PayPal order and transaction IDs. We never
          receive your card or bank details.
        </li>
        <li>
          <strong>Saved tours:</strong> the tours you save for later, linked to
          your account.
        </li>
        <li>
          <strong>Contact form:</strong> your name, email address and message.
          We receive them by email.
        </li>
        <li>
          <strong>Technical data:</strong> our hosting provider records your IP
          address, browser type and the pages you request in server logs.
        </li>
      </ul>

      <h2>Why We Use Your Data</h2>
      <ul>
        <li>
          To manage your account and your bookings, send you booking and payment
          emails, and run the tour. Legal basis: performance of a contract.
        </li>
        <li>
          To keep records of paid bookings. Legal basis: our legal obligations
          under tax and accounting law.
        </li>
        <li>
          To answer your messages, and to keep the website secure and working.
          Legal basis: our legitimate interest.
        </li>
      </ul>
      <p>
        We do not sell your data. We do not use it for advertising, and we do
        not send marketing emails.
      </p>

      <h2>Who Receives Your Data</h2>
      <p>
        We use these service providers. They process your data only as needed
        to provide their service:
      </p>
      <ul>
        <li>
          <strong>Google (Firebase):</strong> sign-in, and storage of accounts,
          bookings and saved tours.
        </li>
        <li>
          <strong>Google (Gmail):</strong> sending and receiving emails.
        </li>
        <li>
          <strong>Vercel:</strong> hosting of the website.
        </li>
        <li>
          <strong>PayPal:</strong> online payments. PayPal is also responsible
          for the data you give to PayPal directly.
        </li>
        <li>
          <strong>WhatsApp (Meta):</strong> only if you contact us through the
          WhatsApp button.
        </li>
      </ul>
      <p>
        Some of these providers process data outside Albania and the European
        Economic Area, for example in the United States. In these cases they
        protect your data with safeguards such as the European Commission&apos;s
        standard contractual clauses.
      </p>
      <p>
        We may also share data when the law requires it, or to protect our
        rights.
      </p>

      <h2>How Long We Keep Your Data</h2>
      <ul>
        <li>
          Account and saved tours: until you delete your account on your
          profile page.
        </li>
        {/* TODO: replace with the exact retention period from the accountant */}
        <li>
          Bookings and payment IDs: as long as tax and accounting law requires.
          When you delete your account, we remove your name, email address,
          phone number and pickup location from your past bookings. You can
          delete your account only when you have no upcoming bookings.
        </li>
        <li>
          Contact messages: as long as we need them to answer your question.
        </li>
      </ul>

      <h2>Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>get a copy of your data</li>
        <li>correct wrong data</li>
        <li>
          have your data deleted. You can delete your account yourself on your
          profile page.
        </li>
        <li>restrict or object to how we use your data</li>
        <li>receive your data in a machine-readable format</li>
      </ul>
      <p>
        To use these rights, email us at <strong>discoverberat@gmail.com</strong>
        . You can also complain to a data protection authority. In Albania, this
        is the Information and Data Protection Commissioner. In the EU, you can
        complain to the authority in your country.
      </p>

      <h2>Security</h2>
      <p>
        We use encrypted connections, store your session in a secure cookie and
        limit who can read your data. No system is fully secure, so we cannot
        guarantee absolute security.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        If we change this policy, we post the new version on this page and
        update the date at the top.
      </p>

      <p>
        For the cookies we use, see our{' '}
        <Button variant="link" href="/cookie-policy">
          Cookie Policy
        </Button>
        .
      </p>
    </div>
  );
}
