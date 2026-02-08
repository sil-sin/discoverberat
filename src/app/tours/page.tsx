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
    <div className={styles.container}>
      {tours ? <Tours tours={tours} pageTitle={'Our tours'} /> : <>No tours</>}
    </div>
  );
}
