'use client';

import { FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './Hero.module.css';
import Button from '../../simple/Button/index';
import { WHATSAPP_URL } from '../Navigation/utils';

export const Hero: FC = () => {
  const router = useRouter();

  return (
    <section className={styles.heroContainer}>
      <h1 className={styles.title}>
        <Image
          className={styles.heroImage}
          src={'/map-track-green.png'}
          alt="Discover Berat"
          width={500}
          height={500}
          priority
        />
      </h1>
      <div className={styles.copy}>
        <p className={styles.lead}>
          Guided tours, wine tastings and transfers with local guides.
        </p>
        <div className={styles.actions}>
          <Button
            className={styles.primary}
            variant="primary"
            onClick={() => router.push('/tours')}
          >
            Browse tours
          </Button>
          <a
            className={styles.whatsapp}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaWhatsapp aria-hidden />
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
