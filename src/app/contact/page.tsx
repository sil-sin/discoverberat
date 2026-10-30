import type { Metadata } from 'next';
import { FaWhatsapp } from 'react-icons/fa';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import ContactForm from '@/components/ContactForm/ContactForm';
import {
  ADDRESS,
  EMAIL,
  OPENING_HOURS,
  PHONE_NUMBER,
  WHATSAPP_URL,
} from '@/components/sectors/Navigation/utils';
import styles from './contact.module.css';

export const metadata: Metadata = {
  title: 'Contact - Discover Berat',
  description: 'Contact Discover Berat by WhatsApp, phone or email.',
  alternates: { canonical: '/contact' },
};

const MAP_MARKER = '40.70531153266283, 19.95121384907549';
const MAP_BBOX = '19.9422,40.7008,19.9622,40.7108';
const DIRECTIONS_URL =
  'https://www.google.com/maps/search/?api=1&query=Discover+Berat&query_place_id=ChIJQ1Y_cDuZWhMRu6CZ0pwtbwA';

type Props = {
  searchParams: Promise<{ transfer?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const { transfer } = await searchParams;
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Contact us</h1>
        <p>
          Ask about a tour, a pickup or a private trip. WhatsApp is the fastest
          way to reach us.
        </p>
      </header>

      <div className={styles.grid}>
        <section className={styles.reach}>
          <h2>Reach us directly</h2>
          <ul className={styles.channels}>
            <li>
              <FaWhatsapp aria-hidden />
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener">
                <span>WhatsApp</span>
                {PHONE_NUMBER}
              </a>
            </li>
            <li>
              <FiPhone aria-hidden />
              <a href={`tel:${PHONE_NUMBER.replace(/ /g, '')}`}>
                <span>Phone</span>
                {PHONE_NUMBER}
              </a>
            </li>
            <li>
              <FiMail aria-hidden />
              <a href={`mailto:${EMAIL}`}>
                <span>Email</span>
                {EMAIL}
              </a>
            </li>
          </ul>

          <h2>Find us</h2>
          <address className={styles.address}>
            {ADDRESS}
            <br />
            {OPENING_HOURS}
          </address>
          <iframe
            className={styles.map}
            title="Map of Discover Berat in Berat"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${MAP_BBOX}&layer=mapnik&marker=${MAP_MARKER}`}
            loading="lazy"
          />
          <a
            className={styles.directions}
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            <FiMapPin aria-hidden />
            Get directions
          </a>
        </section>

        <section className={styles.formCard}>
          <h2>Send a message</h2>
          <ContactForm
            message={
              transfer &&
              `Hi, I would like to book a transfer from ${transfer}.\nDate:\nTime:\nPassengers:\nPickup address:`
            }
          />
        </section>
      </div>
    </div>
  );
}
