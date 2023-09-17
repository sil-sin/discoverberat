'use client'
import { useState, useEffect, FC } from 'react'
import Image from 'next/image'
import HeadBodyGrid from './HeroSkeleton'
import styles from './Hero.module.css'
import Tours from '../Tours/Tours'
export const Hero: FC = () => {
  const [isWideScreen, setIsWideScreen] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => {
      // Check if the screen width is greater than 780px
      setIsWideScreen(window.innerWidth > 780)
    }

    // Initial check and add a resize event listener
    handleResize()
    window.addEventListener('resize', handleResize)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className={styles.heroContainer}>
      {isWideScreen ? (
        <video autoPlay muted loop playsInline className={styles.heroVideo}>
          <source src='/video.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      ) : (
        <Image
          className={styles.heroImage}
          src='/next.svg'
          alt='Hero Image'
          width={600}
          height={400}
        />
      )}
    </div>
  )
}
