import styles from './page.module.css';
import { Tours } from '@/components/tours/Tours';
import { getEntriesByType } from '@/lib/contentful';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Berat Tours: Old Town Walks, Osumi Canyon & Wine Tastings | Discover Berat',
  description:
    'All guided tours in and from Berat: the old town walking tour, Osumi Canyon and Bogova Waterfall, Apollonia, Karavasta Lagoon and winery tastings.',
  alternates: { canonical: '/tours' },
};

export const revalidate = 43200; // 12 hours

export default async function ToursPage() {
  const tours = await getEntriesByType('tourPage');

  return (
    <>
      <header className={styles.header}>
        <h1>Tours from Berat</h1>
        <p>
          Walks through the old town, trips to canyons and lagoons, and wine
          tastings at local wineries. All led by local guides.
        </p>
      </header>
      <Tours tours={tours} withFilters preloadFirst />
    </>
  );
}
