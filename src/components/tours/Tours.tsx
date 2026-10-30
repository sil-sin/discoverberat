'use client';

import { Card } from '@/components/ui/Card';
import React, { FC, useState } from 'react';
import classNames from 'classnames';
import styles from './Tours.module.css';
import { Tour } from '@/lib/types';

// Contentful categories are free text, so filters match keywords in the category and title.
const FILTERS: Record<string, RegExp> = {
  History: /histor|city|museum|apollonia/i,
  Nature: /nature|hiking|canyon|waterfall|lagoon/i,
  Wine: /wine/i,
};

export const Tours: FC<any> = (props: {
  tours: Tour[];
  pageTitle?: string;
  withFilters?: boolean;
  preloadFirst?: boolean;
}) => {
  const { tours, withFilters, preloadFirst } = props;
  const [filter, setFilter] = useState<string | null>(null);

  if (!tours) {
    return (
      <div>
        <h1> No tours found </h1>
      </div>
    );
  }
  const toursCards = (toursByCategory: Tour[]) =>
    toursByCategory?.map((tour: Tour, index: number) => {
      const { title, price, currency, image, url } = tour.fields;

      const imgUrl = image?.fields?.file?.url as string;

      return (
        <li key={title}>
          <Card
            title={title}
            imageSrc={imgUrl ? 'https:' + imgUrl : '/berat.svg'}
            blurDataURL={image?.fields?.file?.blurDataURL}
            preload={preloadFirst && index < 2}
            price={price}
            currency={currency}
            learnMoreLink={`/tours/${url}`}
            imageTransitionName={`tour-image-${url}`}
          />
        </li>
      );
    });

  const sortedTours = tours
    ?.filter((tour: any) => tour.fields?.category?.includes(''))
    .filter(
      (tour: any) =>
        !filter ||
        FILTERS[filter].test(`${tour.fields.category} ${tour.fields.title}`),
    )
    .sort((a: any, b: any) => a.fields.price - b.fields.price);

  return (
    <section className={styles.toursContainer}>
      {props.pageTitle && <h2>{props.pageTitle}</h2>}
      {withFilters && (
        <div className={styles.filters} role="group" aria-label="Filter tours">
          {[null, ...Object.keys(FILTERS)].map((name) => (
            <button
              key={name ?? 'All'}
              type="button"
              aria-pressed={filter === name}
              className={classNames(
                styles.filter,
                filter === name && styles.active,
              )}
              onClick={() => setFilter(name)}
            >
              {name ?? 'All'}
            </button>
          ))}
        </div>
      )}
      <ul className={styles.tourCardsContainer}>{toursCards(sortedTours)}</ul>
    </section>
  );
};
