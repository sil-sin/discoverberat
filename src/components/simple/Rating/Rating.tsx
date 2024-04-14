import { FC } from 'react'
import { Rating } from '@mantine/core'
import styles from './Rating.module.css'
type Props = {
  value?: number
  readOnly?: boolean
}
export const RatingRead: FC<Props> = ({ value = 5, readOnly = true }) => {
  return (
    <div className={styles.container}>
      <Rating
        value={value}
        count={5}
        size='lg'
        color='green'
        readOnly={readOnly}
      />{' '}
      {value}
      reviews
    </div>
  )
}
