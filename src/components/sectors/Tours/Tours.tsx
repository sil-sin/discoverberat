import Card from '@/components/simple/Card'
import React from 'react'
import styles from './Tours.module.css'
import Link from 'next/link' // Import Link from Next.js
import { Tour } from '@/utils/types'

export default function Tours({ tours }: any) {
  if (!tours) {
    return (
      <div>
        <h1>entry not found</h1>
      </div>
    )
  }

  return (
    <div className={styles.toursContainer}>
      <h1 className={styles.toursTitle}>Top tours</h1>
      <div className={styles.tourCardsContainer}>
        {tours?.map((tour: Tour) => {
          const { title, description, price, currency, image, url } =
            tour.fields
          console.log(url)

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
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
