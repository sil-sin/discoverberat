'use client';

import { Button } from '@/components/ui/Button';
import styles from './error.module.css';
import { FlatTireJeep } from '@/components/ui/Doodle';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <FlatTireJeep />
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.lead}>Our jeep got a flat tire. Please try again. If it happens again, message us on WhatsApp.</p>
      </header>
      <div className={styles.actions}>
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
        <Button variant="secondary" href="/">
          Go to the home page
        </Button>
      </div>
    </div>
  );
}
