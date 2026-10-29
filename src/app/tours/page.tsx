import styles from './page.module.css';
import Tours from '@/components/sectors/Tours';
import { getEntriesByType } from '@/utils/contentful/contentful';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tours - Discover Berat',
  description: 'Explore our guided tours and activities in Berat.',
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
      <Tours tours={tours} withFilters />
    </>
  );
}
