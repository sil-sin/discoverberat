import { FC } from 'react'
import Image from 'next/image'
import styles from './Hero.module.css'
import Button from '../../simple/Button/index'

export const Hero: FC = () => {
  return (
    <div className={styles.heroContainer}>
      <Image
        className={styles.heroImage}
        src={'/map-track-green.png'}
        alt='berat image'
        width={500}
        height={500}
      />
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
