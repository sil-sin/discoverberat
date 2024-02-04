import Card from '@/components/simple/Card'
import React, { FC } from 'react'
import styles from './Tours.module.css'
import { Tour } from '@/utils/types'

export const Tours: FC<any> = (props: {
  tours: Tour[]
  pageTitle?: string
}) => {
  const { tours } = props

  if (!tours) {
    return (
      <div>
        <h1> No tours found </h1>
      </div>
    )
  }
  const toursCards = (toursByCategory: Tour[]) =>
    toursByCategory?.map((tour: Tour) => {
      const { title, description, price, currency, image, url } = tour.fields

      const imgUrl = image?.fields?.file?.url as string

      return (
        <div key={title} className={styles.tourCards}>
          <Card
            title={title}
            description={description}
            imageSrc={imgUrl ? 'https:' + imgUrl : ''}
            price={price}
            className={styles.tourCard}
            currency={currency}
            isLoading={!tours}
            learnMoreLink={`/tours/${url}`}
            onClick={() => {
              window.location.href = `/booking/new?tour=${url}`
            }}
          />
        </div>
      )
    })

  const sortedTours = tours
    ?.filter((tour: any) => tour.fields?.category?.includes(''))
    .sort((a: any, b: any) => a.fields.price - b.fields.price)

  return (
    <div className={styles.toursContainer}>
      <div>
        <h2 className={styles.tourCategory}>{props.pageTitle ?? 'Tours'}</h2>
        <div className={styles.tourCardsContainer}>
          {toursCards(sortedTours)}
        </div>
      </div>
    </div>
  )
}
