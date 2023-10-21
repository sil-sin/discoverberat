'use client'
import { FC } from 'react'

import styles from './Hero.module.css'
import Button from '../../simple/Button/index'
export const Hero: FC = () => {
  return (
    <div className={styles.heroContainer}>
      {/* <video autoPlay muted loop playsInline className={styles.heroVideo}>
        <source src='/video.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video> */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.heroImage} src='/next.svg' alt='Hero Image' />
      <Button
        className={styles.bookTourButton}
        variant='primary'
        onClick={() => {
          window.location.href = '/tours'
        }}
      >
        Book a Tour
      </Button>
    </div>
  )
}
