import Link from 'next/link';
import type { Metadata } from 'next';
import { FaWhatsapp } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { getEntriesByType } from '@/utils/contentful/contentful';
import { WHATSAPP_URL } from '@/components/sectors/Navigation/utils';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Transfers - Discover Berat',
  description:
    'Private transfers from Berat to Tirana Airport, Gjirokaster, Ksamil and more. Fixed price per car for up to 3 people, booked directly with Discover Berat.',
  alternates: { canonical: '/services/transfers' },
};

export const revalidate = 43200; // 12 hours

export default async function TransfersPage() {
  const transfers = await getEntriesByType('transfers', {
    order: 'fields.price',
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Transfers from Berat</h1>
        <p>
          Private rides to the airport, Tirana and the south coast. Fixed price
          per car, for up to 3 people. More people?{' '}
          <Link href="/contact">Contact us</Link> for a group price.
        </p>
      </header>

      <ul className={styles.routes}>
        {transfers.map(({ sys, fields }: any) => {
          const route = `${fields.from.trim()} to ${fields.to.trim()}`;
          return (
            <li key={sys.id}>
              <Link
                className={styles.route}
                href={{
                  pathname: '/contact',
                  query: { transfer: route },
                  hash: 'message',
                }}
                aria-label={`${route}, €${fields.price}. Request this transfer`}
              >
                <span className={styles.place}>
                  <strong>{fields.to.trim()}</strong>
                  {fields.distance}
                </span>
                <span className={styles.price}>€{fields.price}</span>
                <FiArrowRight aria-hidden className={styles.arrow} />
              </Link>
            </li>
          );
        })}
        <li>
          <Link className={`${styles.route} ${styles.other}`} href="/contact">
            <span className={styles.place}>
              <strong>Somewhere else?</strong>
              Ask us for a price
            </span>
            <FiArrowRight aria-hidden className={styles.arrow} />
          </Link>
        </li>
      </ul>

      <section className={styles.cta}>
        <div>
          <h2>Questions about a ride?</h2>
          <p>
            Luggage, extra stops or an early pickup: WhatsApp is the fastest
            way to ask.
          </p>
        </div>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener">
          <FaWhatsapp aria-hidden />
          Message us on WhatsApp
        </a>
      </section>
    </div>
  );
}
