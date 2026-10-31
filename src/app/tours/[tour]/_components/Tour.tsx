'use client';

import { marked } from 'marked';
import type {} from 'react/canary';
import React, { FC, ViewTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import styles from './Tour.module.css';
import { Button } from '@/components/ui/Button';
import { MobileBar } from '@/components/ui/MobileBar';
import useSaveLater from '@/hooks/useSaveLater';
import { WHATSAPP_URL } from '@/lib/site';
import { useAuthContext } from '@/lib/auth/auth-provider';

export const Tour: FC<{ tour: any }> = ({ tour }) => {
  const {
    id,
    price,
    title,
    description,
    currency,
    imgUrl,
    url,
    blurDataURL,
    isDayTrip,
  } = tour;
  const router = useRouter();
  const { handleSaveLater, isSaving } = useSaveLater({ id, title, price, currency, url });
  const { user, loading, openAuth } = useAuthContext();
  const book = () => {
    router.push(`/booking/new?tour=${url}`);
    if (!user && !loading) openAuth('book');
  };
  const imageUrl = imgUrl.startsWith('https://') ? imgUrl : `https:${imgUrl}`;
  // The page title is the only h1, so headings inside the description start at h2.
  const descriptionHtml = marked((description ?? '').replace(/^# /gm, '## '), {
    breaks: true,
  });

  return (
    <article className={styles.container}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <Link href="/tours">Tours</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">{title}</span>
      </nav>
      <h1 className={styles.title}>{title}</h1>

      <ViewTransition name={`tour-image-${url}`}>
        <Image
          priority
          className={styles.image}
          width={1200}
          height={675}
          sizes="(min-width: 1120px) 1120px, 100vw"
          alt={title}
          src={imageUrl}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          onContextMenu={(event) => event.preventDefault()}
        />
      </ViewTransition>

      <div className={styles.layout}>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />

        <aside className={styles.booking} aria-label="Book this tour">
          <p className={styles.price}>
            <strong>
              {currency}
              {price}
            </strong>{' '}
            per person
          </p>
          <ul className={styles.facts}>
            {isDayTrip && (
              <li>
                <FiCheck aria-hidden /> Day trip
              </li>
            )}
            <li>
              <FiCheck aria-hidden /> Pay online or on the day
            </li>
            <li>
              <FiCheck aria-hidden />
              <span>
                Free cancellation up to 24 hours before.{' '}
                <Link href="/refund-policy">Refund policy</Link>
              </span>
            </li>
          </ul>
          <Button className={styles.button} onClick={book} variant="primary">
            Book tour
          </Button>
          <Button
            className={styles.button}
            onClick={handleSaveLater}
            isLoading={isSaving}
            variant="secondary"
          >
            Save for later
          </Button>
          <a
            className={styles.whatsapp}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaWhatsapp aria-hidden />
            Questions? Ask on WhatsApp
          </a>
        </aside>
      </div>

      <MobileBar
        label={
          <>
            <strong>
              {currency}
              {price}
            </strong>{' '}
            per person
          </>
        }
      >
        <Button onClick={book} variant="primary">
          Book tour
        </Button>
      </MobileBar>
    </article>
  );
};
