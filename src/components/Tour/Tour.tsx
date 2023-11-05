import { marked } from 'marked'
import React from 'react'
import Image from 'next/image'
import styles from './Tour.module.css'
import Button from '../simple/Button'
export function Tour({ tour }: { tour: any }) {
  const { price, title, description, currency, imgUrl } = tour
  console.log({ imgUrl })
  const imageUrl = imgUrl.includes('https://') ? imgUrl : `https:${imgUrl}`

  const htmlTextField = marked(description ?? '')
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <article
        onContextMenu={(event: React.MouseEvent) => {
          event.preventDefault()
        }}
        className={styles.tourContainer}
      >
        <Image
          loading='lazy'
          width={1000}
          height={1000}
          alt={title + 'image'}
          src={imageUrl}
        />
        <div dangerouslySetInnerHTML={{ __html: htmlTextField }} />
        <p>
          Price: {price} {currency} per person
        </p>
        <Button className={styles.button} variant='primary'>
          Book Tour
        </Button>
      </article>
    </div>
  )
}
