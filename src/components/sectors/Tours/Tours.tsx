import Card from '@/components/simple/Card'
import React from 'react'
import styles from './Tours.module.css'
import Link from 'next/link' // Import Link from Next.js

type Tour = {
  title: string
  description: string
  price: number
  currency: string
  imgUrl?: string
  link: string
}
export default function Tours(tours: Tour[]) {
  // const tours = [
  //   {
  //     title: 'Osumi Canyon & Bogova Waterfall',
  //     description:
  //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.',
  //     image: 'next.svg',
  //     price: '50 EUR',
  //     link: 'osumi-canyon-and-bogova-waterfall',
  //   },
  //   {
  //     title: 'Tomori Mountain ',
  //     description:
  //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.',
  //     image: 'next.svg',
  //     price: '50 EUR',
  //     link: 'tomori-mountain',
  //   },
  //   {
  //     title: 'Berat City Tour',
  //     description:
  //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.',
  //     image: 'next.svg',
  //     price: '50 EUR',
  //     link: 'berat-city-tour',
  //   },
  // ]
  console.log('tours:', tours)

  return (
    <div className={styles.toursContainer}>
      <h1 className={styles.toursTitle}>Top tours</h1>
      <div className={styles.tourCardsContainer}>
        {/* {tours?.map((tour: Tour) => (
          <Link
            href={`/tours/${tour.link}`}
            key={tour.link}
            className={styles.tourCards}
          >
            <Card
              title={tour.title}
              description={tour.description}
              imageSrc={tour.imgUrl}
              price={tour.price}
              className={styles.tourCard}
            />
          </Link>
        ))} */}
      </div>
    </div>
  )
}
