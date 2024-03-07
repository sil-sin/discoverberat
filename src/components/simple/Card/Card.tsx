import React, { FC } from 'react'
import styles from './Card.module.css'
import Image from 'next/image'
import classNames from 'classnames'
import Button from '../Button'

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
  learnMoreLink?: string
  onClick?: () => void
}

export const Card: FC<Props> = ({
  title = 'Card Title',
  imageSrc = '/vercel.svg',
  price,
  currency,
  isLoading = false,
  className,
  iconCard = false,
  cardIcon,
  onClick,
  learnMoreLink,
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
        <Image
          loading='lazy'
          className={styles.image}
          src={imageSrc}
          width={400}
          height={250}
          alt='Explore Berat'
        />
        <div className={styles.title}> {title}</div>

        {price && (
          <p className={styles.price}>
            <span>
              From
              <span className={styles.priceSpan}>
                {currency}
                {price}
              </span>
              /person
            </span>
            <Button variant='link' href={learnMoreLink} text='Tour details' />
          </p>
        )}
        <div className={styles.linkButton}>
          <Button onClick={onClick} variant='primary' className={styles.button}>
            Book Tour
          </Button>
        </div>
      </div>
      {isLoading && <div className={styles.cardSkeleton}></div>}
    </>
  )
}
