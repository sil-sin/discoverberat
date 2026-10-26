import { FC } from 'react'
import styles from './Loader.module.css'

export const Loader: FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className={styles.container} role='status'>
      <svg className={styles.scene} viewBox='0 0 160 90' aria-hidden='true'>
        <g className={styles.hills}>
          <path d='M0 70 L30 40 L50 55 L80 25 L110 55 L130 42 L160 70 Z' />
          <path d='M160 70 L190 40 L210 55 L240 25 L270 55 L290 42 L320 70 Z' />
        </g>
        <line className={styles.trail} x1='0' y1='78' x2='160' y2='78' />
        <g className={styles.hiker}>
          <circle cx='78' cy='38' r='5' />
          <rect className={styles.backpack} x='68' y='44' width='7' height='12' rx='2' />
          <line x1='77' y1='44' x2='77' y2='60' />
          <line className={styles.arm} x1='77' y1='47' x2='77' y2='57' />
          <line className={styles.pole} x1='86' y1='52' x2='90' y2='77' />
          <line className={`${styles.leg} ${styles.legFront}`} x1='77' y1='60' x2='77' y2='77' />
          <line className={`${styles.leg} ${styles.legBack}`} x1='77' y1='60' x2='77' y2='77' />
        </g>
      </svg>
      <p className={styles.text}>{text}</p>
    </div>
  )
}
