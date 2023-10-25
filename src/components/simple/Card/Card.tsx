import React, { FC } from 'react'
import styles from './Card.module.css'
import Image from 'next/image'
import classNames from 'classnames'

type Props = {
  title?: string
  imageSrc?: string
  description?: string
  price?: number
  isLoading?: boolean
  className?: string
  iconCard?: boolean
  cardIcon?: any
  currency?: string
}

export const Card: FC<Props> = ({
  title = 'Card Title',
  imageSrc = '/vercel.svg',
  description,
  price,
  isLoading = false,
  className,
  iconCard = false,
  cardIcon,
}) => {
  if (iconCard) {
    return (
      <div className={classNames(styles.iconCardContainer, className)}>
        <div className={styles.cardIcon}>{cardIcon}</div>
        <div className={styles.iconCardTitle}>
          <div> {title}</div>
        </div>
      </div>
    )
  }
  return (
    <>
      <div className={classNames(styles.cardContainer, className)}>
        <div>
          <div className={styles.title}>
            <div> {title}</div>
          </div>
          <Image
            className={styles.image}
            src={imageSrc}
            width={100}
            height={100}
            alt='Explore Berat'
          />
        </div>
        {description && <p className={styles.description}>{description}</p>}
        {price && <p className={styles.price}> Starting from {price}</p>}
      </div>
      {isLoading && <div className={styles.cardSkeleton}></div>}
    </>
  )
}
