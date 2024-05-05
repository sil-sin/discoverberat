import React, { FC, useState, useEffect } from 'react'
import styles from './TestimonialContainer.module.css'
import { Testimonial } from './Testimonial'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css' // Import Swiper styles
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {
  EffectCoverflow,
  Keyboard,
  Navigation,
  Pagination,
} from 'swiper/modules'

interface Review {
  author_name: string
  text: string
  profile_photo_url: string
  rating: number
}

interface TestimonialContainerProps {
  reviews: Review[]
}

export const TestimonialContainer: FC<TestimonialContainerProps> = ({
  reviews,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide(
      (prevSlide) =>
        (prevSlide + 1) % reviews.filter((review) => review.text).length
    )
  }

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) =>
        (prevSlide - 1 + reviews.filter((review) => review.text).length) %
        reviews.filter((review) => review.text).length
    )
  }
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.testimonialsHeaderContainer}>
        <h2 className={styles.testimonialsHeader}>
          See What Our Visitors Think
        </h2>
        <p className={styles.averageRating}>
          Our guests have rated us{' '}
          {averageRating % 1 === 0
            ? averageRating.toFixed(0)
            : averageRating.toFixed(1)}{' '}
          / 5 on average!
        </p>
      </div>
      <Swiper
        style={{ maxWidth: '900px', width: '100%', zIndex: 0 }}
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        keyboard={{
          enabled: true,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Keyboard, EffectCoverflow, Navigation, Pagination]}
        className={styles.swiper}
      >
        {reviews.map(
          (review, index) =>
            review.text && (
              <SwiperSlide
                style={{ width: '300px', zIndex: 0 }}
                key={index}
                className={`swiper-slide ${styles.slide} ${
                  index === currentSlide ? styles.active : ''
                }`}
              >
                <Testimonial review={review} />
              </SwiperSlide>
            )
        )}
      </Swiper>
    </section>
  )
}
