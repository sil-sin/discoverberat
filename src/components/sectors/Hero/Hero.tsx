'use client';

import { FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Hero.module.css';
import Button from '../../simple/Button/index';

export const Hero: FC = () => {
  const router = useRouter();

  return (
    <div className={styles.heroContainer}>
      <Image
        className={styles.heroImage}
        src={'/map-track-green.png'}
        alt="berat image"
        width={500}
        height={500}
      />
      <Button
        className={styles.bookTourButton}
        variant="primary"
        onClick={() => router.push('/tours')}
      >
        Book a Tour
      </Button>
    </div>
  );
};
