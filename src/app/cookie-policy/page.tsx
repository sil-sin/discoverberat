import Button from '@/components/simple/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - Discover Berat',
  description: 'Cookie Policy for Discover Berat website.',
};

export default function CookiePolicyPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Cookie Policy</h1>
      <p>Last updated: 27 October 2026</p>
      <p>
        We use only cookies that are needed for the website to work. We do not
        use analytics, advertising or tracking cookies.
      </p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small text files that a website stores on your device. The
        website reads them on your next visit.
      </p>

      <h2>Cookies We Use</h2>
      <ul>
        <li>
          <strong>token:</strong> keeps you signed in. It expires after 1 hour.
        </li>
        <li>
          <strong>visitedBefore:</strong> remembers that you have seen the
          cookie notice. It is deleted when you close your browser.
        </li>
        <li>
          <strong>lastHideTimestamp:</strong> hides the cookie notice after you
          click &quot;Okay&quot;. It expires after 90 days.
        </li>
      </ul>
      <p>
        Firebase Authentication also stores your sign-in session in your
        browser&apos;s storage.
      </p>

      <h2>Third-Party Cookies</h2>
      <ul>
        <li>
          <strong>PayPal</strong> sets cookies when you open the online payment.
          They are needed for a secure payment.
        </li>
        <li>
          <strong>Google</strong> sets cookies when you sign in with Google.
        </li>
      </ul>
      <p>These cookies are controlled by PayPal and Google, not by us.</p>

      <h2>Managing Cookies</h2>
      <p>
        You can block or delete cookies in your browser settings. If you block
        them, you cannot sign in or book a tour.
      </p>

      <h2>Updates to This Policy</h2>
      <p>
        If we change this policy, we post the new version on this page and
        update the date at the top.
      </p>

      <p>
        For how we handle your personal data, see our{' '}
        <Button variant="link" href="/privacy-policy">
          Privacy Policy
        </Button>
        .
      </p>
    </div>
  );
}
