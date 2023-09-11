import React, { FC } from 'react'
import styles from './Card.module.css'
import Image from 'next/image'

type Props = {
  title?: string
  imageSrc?: string
  description?: string
  price?: string
}

export const Card: FC<Props> = ({
  title = 'Card Title',
  imageSrc = '/vercel.svg',
  description,
  price = '100 EUR',
}) => {
  description =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.s'
  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.title}>
          <h3> {title}</h3>
        </div>
        <Image
          className={styles.image}
          src={imageSrc}
          width={100}
          height={100}
          alt='Explore Berat'
        />
        <p className={styles.description}>{description}</p>
        <p className={styles.price}> Starting from {price}</p>
      </div>
      <div className={styles.cardSkeleton}></div>
    </>
  )
}
