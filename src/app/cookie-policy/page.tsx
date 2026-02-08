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
      <p>
        Our website uses cookies to enhance the user experience and provide
        personalized content and advertising. By using our website, you consent
        to our use of cookies in accordance with this Cookie Policy.
      </p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small text files that are placed on your computer or mobile
        device when you visit a website. They are widely used to make websites
        work more efficiently and to provide information to website owners.
      </p>

      <h2>How We Use Cookies</h2>
      <p>Our uses of cookies fall into the following general categories:</p>
      <ul>
        <li>
          <strong>Essential:</strong> Some cookies are necessary for the
          operation of our sites, services, applications, and tools. This
          includes technologies that allow you access to our sites, services,
          applications, and tools; that are required to identify irregular site
          behavior, prevent fraudulent activity and improve security; or that
          allow you to make use of our functions such as shopping-carts, saved
          search, or similar functions.
        </li>
        <li>
          <strong>Performance:</strong> We may use cookies to assess the
          performance of our websites, applications, services, and tools,
          including as part of our analytic practices to help us understand how
          our visitors use our websites, determine if you have interacted with
          our messaging, determine whether you have viewed an item or link, or
          to improve our website content, applications, services, or tools.
        </li>
        <li>
          <strong>Functionality:</strong> We may use cookies that allow us to
          offer you enhanced functionality when accessing or using our sites,
          services, applications, or tools. This may include identifying you
          when you sign into our sites or keeping track of your specified
          preferences, interests, or past items viewed so that we may enhance
          the presentation of content on our sites.
        </li>
        <li>
          <strong>Marketing:</strong> We may use first-party or third-party
          cookies to deliver content, including targeted advertising and
          remarketing, on our sites or on third-party sites. This includes using
          technologies to understand how you interact with our services, the
          usefulness to you of the advertisements and content that have been
          delivered to you, such as whether you have clicked on an
          advertisement, measuring whether ad clicks resulted in successful
          outcomes, to help optimize our advertisement strategy to reach similar
          prospects, or help minimize advertisement that is not relevant to some
          users.
        </li>
      </ul>

      <h2>Managing Cookies</h2>
      <p>
        You can control and manage cookies in various ways. Please refer to your
        browser&apos;s settings or help documentation to learn how to adjust
        your cookie preferences.
      </p>

      <h2>Cookie Usage for Authentication and Payment</h2>
      <p>
        Rest assured, our cookies are solely for authentication purposes, while
        PayPal employs cookies for their secure payment services.
      </p>

      <h2>Updates to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time. Any changes will be
        posted on this page with an updated revision date. We encourage you to
        review this policy periodically for any updates or changes.
      </p>

      <p>
        For more information about how we handle your personal data and your
        rights under applicable data protection laws, please see our
        <Button variant="link" href="/privacy-policy">
          Privacy Policy
        </Button>
        .
      </p>
    </div>
  );
}
