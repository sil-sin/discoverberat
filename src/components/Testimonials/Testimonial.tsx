import styles from './Testimonial.module.css'
import Image from 'next/image'
export const Testimonial = ({ review }: any) => {
  if (!review) return null
  console.log(review)

  return (
    <>
      {review.text && (
        <div key={review?.author_name} className={styles.testimonialContainer}>
          <h4>{review?.author_name}</h4>
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
          </div>
          <h4 className={styles.testimonialQuote}>&ldquo;</h4>
          <p className={styles.testimonialText}>{review?.text}</p>
        </div>
      )}
    </>
  )
}
