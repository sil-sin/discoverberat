import React, { FC } from 'react'
import styles from './Card.module.css'
import Image from 'next/image'
import classNames from 'classnames'

type Props = {
  title?: string
  imageSrc?: string
  description?: string
  price?: string
  isLoading?: boolean
  className?: string
}

export const Card: FC<Props> = ({
  title = 'Card Title',
  imageSrc = '/vercel.svg',
  description,
  price,
  isLoading = false,
  className,
}) => {
  return (
    <>
      <div className={classNames(styles.cardContainer, className)}>
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
        {description && <p className={styles.description}>{description}</p>}
        {price && <p className={styles.price}> Starting from {price}</p>}
      </div>
      {isLoading && <div className={styles.cardSkeleton}></div>}
    </>
  )
}
