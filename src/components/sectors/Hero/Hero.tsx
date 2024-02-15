// Hero.tsx

import { FC } from 'react'
import Image from 'next/image'
import styles from './Hero.module.css'
import Button from '../../simple/Button/index'

export const Hero: FC = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroImage}>
        <h1
          onContextMenu={(event: React.MouseEvent) => {
            event.preventDefault()
          }}
        >
          Discover Berat
        </h1>
      </div>
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
