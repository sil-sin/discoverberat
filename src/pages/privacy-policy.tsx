import React from 'react'
import Button from '@/components/simple/Button' // Assuming this is the correct import

const PrivacyPolicyPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Privacy Policy</h1>
      <p>
        This Privacy Policy describes how we collect, use, and disclose your
        personal information when you use our website. By using our website, you
        consent to the collection, use, and disclosure of your personal
        information as described in this Privacy Policy.
      </p>

      <h2>Information Collection and Use</h2>
      <p>
        We collect certain information about you when you visit our website,
        including:
      </p>
      <ul>
        <li>
          Information you provide to us voluntarily, such as when you fill out
          forms or contact us.
        </li>
        <li>
          Information automatically collected when you use our website, such as
          your IP address, browser type, and usage data.
        </li>
      </ul>
      <p>
        We may use this information for various purposes, including to provide
        and improve our services, communicate with you, and personalize your
        experience.
      </p>

      <h2>Information Sharing</h2>
      <p>
        We may share your personal information with third-party service
        providers who assist us in operating our website, conducting our
        business, or providing services to you. We may also share your
        information in response to legal requests or to protect our rights or
        the rights of others.
      </p>

      <h2>Security</h2>
      <p>
        We take reasonable measures to protect your personal information from
        unauthorized access, use, or disclosure. However, no method of
        transmission over the internet or electronic storage is 100% secure, so
        we cannot guarantee absolute security.
      </p>

      <h2>Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with an updated revision date. We encourage you to
        review this Privacy Policy periodically for any updates or changes.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        contact us via email at <strong>discoverberat@gmail.com</strong> or by
        using the contact form on our website.
      </p>

      <p>
        For more information about our use of cookies, please see our{' '}
        <Button variant='link' href='/cookie-policy'>
          Cookie Policy
        </Button>
        .
      </p>
    </div>
  )
}

export default PrivacyPolicyPage
