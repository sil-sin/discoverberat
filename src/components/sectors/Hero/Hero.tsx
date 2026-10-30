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
      <div className={styles.title}>
        <Image
          className={styles.heroImage}
          src={'/map-track-green.png'}
          alt="Discover Berat"
          width={1080}
          height={582}
          sizes="(min-width: 700px) 640px, 100vw"
          preload
          fetchPriority="high"
        />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.lead}>
          Tours in Berat: guided walks, wine tastings and transfers with local guides.
        </h1>
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
