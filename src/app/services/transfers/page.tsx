import styles from './page.module.css';
import { getEntriesByType } from '@/utils/contentful/contentful';
import { Transfers } from '@/components/sectors/Transfers/Transfers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transfers - Discover Berat',
  description: 'Transport and transfer services by Discover Berat.',
};

export const revalidate = 43200; // 12 hours

export default async function TransfersPage() {
  const transfers = await getEntriesByType('transfers');

  return (
    <div className={styles.container}>
      {transfers ? (
        <Transfers transfers={transfers} pageTitle={'Our transfers'} />
      ) : (
        <>No transfers</>
      )}
    </div>
  );
}
