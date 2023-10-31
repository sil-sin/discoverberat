import Card from '@/components/simple/Card'
import React, { FC } from 'react'
import styles from './Tours.module.css'
import Link from 'next/link' // Import Link from Next.js
import { Tour } from '@/utils/types'

export const Tours: FC<any> = (props: { tours: Tour[] }) => {
  const { tours } = props

  if (!tours) {
    return (
      <div>
        <h1>entry not found</h1>
      </div>
    )
  }
  const toursCards = (toursByCategory: Tour[]) =>
    toursByCategory?.map((tour: Tour) => {
      const { title, description, price, currency, image, url } = tour.fields

      const imgUrl = image?.fields?.file?.url as string
      const descriptionParagraphs = description?.content?.map(
        (item: any, index: number) => {
          const paragraph = item?.content[0]?.value
          const markType = item?.content[0]?.marks
        }
      )

      return (
        <Link href={`/tours/${url}`} key={url} className={styles.tourCards}>
          <Card
            title={title}
            description={descriptionParagraphs}
            imageSrc={imgUrl ? 'https:' + imgUrl : ''}
            price={price}
            className={styles.tourCard}
            currency={currency}
            isLoading={!tours}
          />
        </Link>
      )
    })

  const topTours = tours?.filter((tour: any) =>
    tour.fields?.category?.includes('top')
  )

  const natureTours = tours?.filter((tour: any) =>
    tour.fields?.category?.includes('nature')
  )

  const historicalTours = tours?.filter((tour: any) =>
    tour.fields?.category?.includes('historical')
  )

  return (
    <div className={styles.toursContainer}>
      <h1 className={styles.toursTitle}>All tours</h1>
      <div>
        <h2 className={styles.tourCategory}>Top tours</h2>
        <div className={styles.tourCardsContainer}>{toursCards(topTours)}</div>
        <h2 className={styles.tourCategory}>Nature tours</h2>
        <div className={styles.tourCardsContainer}>
          {toursCards(natureTours)}
        </div>
        <h2 className={styles.tourCategory}>Historical tours</h2>
        <div className={styles.tourCardsContainer}>
          {toursCards(historicalTours)}
        </div>
      </div>
    </div>
  )
}
