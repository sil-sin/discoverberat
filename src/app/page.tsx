import Hero from '@/components/sectors/Hero/index';
import OurServices from '@/components/sectors/OurServices';
import Tours from '@/components/sectors/Tours';
import { getEntriesByType } from '@/utils/contentful/contentful';
import { FaWhatsapp } from 'react-icons/fa';
import { FiCalendar, FiCreditCard, FiMapPin, FiUsers } from 'react-icons/fi';
import { WHATSAPP_URL } from '@/components/sectors/Navigation/utils';
import styles from './page.module.css';
// import { TestimonialContainer } from '@/components/sectors/Testimonials/TestimonialsContainer';
import type { Metadata } from 'next';
import { HomeClient } from './HomeClient';


export const metadata: Metadata = {
  title: 'Discover Berat - Tour Operator',
  description:
    'Discover the charm, embrace the stories, and make memories that last a lifetime. Welcome to Discover Berat - Where Every Journey Tells a Tale.',
  openGraph: {
    type: 'website',
    url: 'https://discoverberat.com/',
    title: 'Discover Berat - Tour Operator',
    description:
      'Discover the charm, embrace the stories, and make memories that last a lifetime. Welcome to Discover Berat - Where Every Journey Tells a Tale.',
    images: [
      'https://images.ctfassets.net/vzi02yirpwbf/5IgNZ5fK06tYapDIIs6bjO/6da1941f117f3cdafd4a0a5374023e23/favicon.ico',
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Berat - Tour Operator',
    description:
      'Discover the charm, embrace the stories, and make memories that last a lifetime. Welcome to Discover Berat - Where Every Journey Tells a Tale.',
    images: [
      'https://images.ctfassets.net/vzi02yirpwbf/5IgNZ5fK06tYapDIIs6bjO/6da1941f117f3cdafd4a0a5374023e23/favicon.ico',
    ],
  },
};

export const revalidate = 43200; // 12 hours

// TODO: re-enable reviews once the Google Places call works again; it currently rejects and slows the page load.
// async function getReviews() {
//   try {
//     const res = await fetch(
//       `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJQ1Y_cDuZWhMRu6CZ0pwtbwA&key=${process.env.GOOGLE_PLACES_KEY}`,
//       { next: { revalidate: 43200 } },
//     );
//     const data = await res.json();
//     if (data.status !== 'OK')
//       console.error('Google Places reviews:', data.status, data.error_message);
//     return data.result?.reviews?.map((item: any) => item) || null;
//   } catch {
//     return null;
//   }
// }

const REASONS = [
  { Icon: FiUsers, title: 'Local guides', text: 'Led by our team of Berat guides.' },
  {
    Icon: FiCalendar,
    title: 'Free cancellation',
    text: 'Up to 24 hours before the tour. PayPal refunds exclude the PayPal fee.',
  },
  {
    Icon: FiCreditCard,
    title: 'Pay your way',
    text: 'Online with PayPal or on the day.',
  },
  { Icon: FiMapPin, title: 'Pickup', text: 'Choose where we meet you.' },
];

export default async function Home() {
  const [tours, transfers] = await Promise.all([
    getEntriesByType('tourPage'),
    getEntriesByType('transfers'),
    // getReviews(),
  ]);

  if (!tours || !transfers) return null;

  const topTours = tours?.filter((tour: any) =>
    tour.fields?.category?.includes('top'),
  );

  return (
    <div className="main">
      <Hero />
      <ul className={styles.reasons} aria-label="Why book with us">
        {REASONS.map(({ Icon, title, text }) => (
          <li key={title}>
            <Icon aria-hidden />
            <strong>{title}</strong>
            {text}
          </li>
        ))}
      </ul>
      <OurServices />
      <Tours tours={topTours} pageTitle={'Popular tours'} />
      <HomeClient />
      <section className={styles.cta}>
        <div>
          <h2>Not sure which tour fits?</h2>
          <p>Tell us your dates and group size. We help you choose.</p>
        </div>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener">
          <FaWhatsapp aria-hidden />
          Message us on WhatsApp
        </a>
      </section>
      {/* {reviews && <TestimonialContainer reviews={reviews} />} */}
    </div>
  );
}
