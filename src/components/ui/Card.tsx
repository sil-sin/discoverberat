'use client';

import type {} from 'react/canary';
import React, { FC, ViewTransition } from 'react';
import styles from './Card.module.css';
import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames';
import { FiArrowUpRight } from 'react-icons/fi';

type Props = {
  title: string;
  imageSrc: string;
  blurDataURL?: string;
  preload?: boolean;
  imageTransitionName?: string;
  price?: number;
  currency?: string;
  learnMoreLink: string;
  className?: string;
};

export const Card: FC<Props> = ({
  title,
  imageSrc,
  blurDataURL,
  preload,
  imageTransitionName,
  price,
  currency,
  learnMoreLink,
  className,
}) => {
  const image = (
    <Image
      preload={preload}
      className={styles.image}
      src={imageSrc}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      width={480}
      height={600}
      sizes="(min-width: 1120px) 360px, (min-width: 700px) 50vw, 100vw"
      alt=""
    />
  );

  return (
    <Link href={learnMoreLink} className={classNames(styles.card, className)}>
      {imageTransitionName ? (
        <ViewTransition name={imageTransitionName}>{image}</ViewTransition>
      ) : (
        image
      )}
      <span className={styles.overlay}>
        <span className={styles.title}>{title}</span>
        {price && (
          <span className={styles.price}>
            <strong>
              {currency}
              {price}
            </strong>{' '}
            per person
          </span>
        )}
      </span>
      <FiArrowUpRight aria-hidden className={styles.arrow} />
    </Link>
  );
};
