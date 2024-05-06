import styles from './Testimonial.module.css'
import Image from 'next/image'
export const Testimonial = ({ review }: any) => {
  if (!review) return null

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
          <p className={styles.testimonialText}>{review?.text}</p>
        </div>
      )}
    </>
  )
}
