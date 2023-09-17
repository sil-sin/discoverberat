import Card from '@/components/simple/Card'
import React from 'react'
import styles from './Tours.module.css'
import Button from '@/components/simple/Button'
export default function Tours() {
  const tours = [
    {
      title: 'Osumi Canyon & Bogova Waterfall',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.',
      image: 'next.svg',
      price: '50 EUR',
    },
    {
      title: 'Tomori Mountain ',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.',
      image: 'next.svg',
      price: '50 EUR',
    },
    {
      title: 'Berat City Tour',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.',
      image: 'next.svg',
      price: '50 EUR',
    },
  ]
  return (
    <div className={styles.toursContainer}>
      <h1 className={styles.toursTitle}>
        <Button className={styles.toursButton} variant='link' href='/tours'>
          Tours
        </Button>
      </h1>
      <div className={styles.tourCardsContainer}>
        {tours.map((tour) => (
          <div key={tour.title}>
            <Card
              title={tour.title}
              description={tour.description}
              imageSrc={tour.image}
              price={tour.price}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
