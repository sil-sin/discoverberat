import { useState } from 'react'
import styles from './Testimonial.module.css'
import Image from 'next/image'

export const Testimonial = ({ review }: any) => {
  const [showFullText, setShowFullText] = useState(false)
  const characterLimit = 250
  if (!review) return null

  const toggleShowFullText = () => {
    setShowFullText(!showFullText)
  }

  const truncatedText =
    review.text.length > characterLimit
      ? review.text.substring(0, characterLimit) + '...'
      : review.text

  return (
    <>
      {review.text && (
        <div key={review?.author_name} className={styles.testimonialContainer}>
          <p className={styles.testimonialAuthor}>{review?.author_name}</p>
          <Image
            className={styles.testimonialImage}
            src={review?.profile_photo_url}
            alt='berat image'
            width={170}
            height={170}
          />

          <div className={styles.testimonialRating}>
            {Array(review?.rating)
              .fill(0)
              .map((_, i) => (
                <span key={i} className={styles.ratingStar}>
                  &#9733;
                </span>
              ))}
            <p className={styles.testimonialRelativeTime}>
              ({review?.relative_time_description})
            </p>
          </div>
          <p className={styles.testimonialQuote}>&ldquo;</p>
          <p className={styles.testimonialText}>
            {showFullText ? review.text : truncatedText}
            {review.text.length > characterLimit && (
              <small className={styles.moreLink} onClick={toggleShowFullText}>
                {showFullText ? ' Show less' : ' Show more'}
              </small>
            )}
          </p>
        </div>
      )}
    </>
  )
}
