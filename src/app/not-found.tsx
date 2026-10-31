import { Button } from '@/components/ui/Button';
import type { Metadata } from 'next';
import styles from './error.module.css';
import { LostTourist } from '@/components/ui/Doodle';

export const metadata: Metadata = {
  title: 'Page not found - Discover Berat',
};

export default function NotFound() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <LostTourist />
        <h1 className={styles.title}>We could not find this page</h1>
        <p className={styles.lead}>Even on Gorica Bridge you can take a wrong turn. The link may be old, or the page has moved.</p>
      </header>
      <div className={styles.actions}>
        <Button variant="primary" href="/tours">
          Browse tours
        </Button>
        <Button variant="secondary" href="/">
          Go to the home page
        </Button>
      </div>
    </div>
  );
}
