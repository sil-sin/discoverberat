import { marked } from 'marked'
import React, { FC } from 'react'
import Image from 'next/image'
import styles from './Tour.module.css'
import Button from '../simple/Button'
import { useRouter } from 'next/router'

export const Tour: FC<{ tour: any }> = ({ tour }) => {
  const { price, title, description, currency, imgUrl, url } = tour
  const router = useRouter()
  const imageUrl = imgUrl
    ? imgUrl.includes('https://')
      ? imgUrl
      : `https:${imgUrl}`
    : 'vercel.svg'

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
          priority
          width={800}
          height={800}
          alt={title + 'image'}
          src={imageUrl}
        />
        <div dangerouslySetInnerHTML={{ __html: htmlTextField }} />
        <p>
          Price: {price} {currency} per person
        </p>
        <Button
          className={styles.button}
          onClick={() => {
            router.push(`/booking/new?tour=${url}`)
          }}
          variant='primary'
        >
          Book Tour
        </Button>
      </article>
    </div>
  )
}
