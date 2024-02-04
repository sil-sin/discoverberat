import React, { FC } from 'react'
import styles from './TransferCard.module.css'
import { MdEast } from 'react-icons/md'
import classNames from 'classnames'

export const TransfersCard: FC<any> = (props: {
  transfer: any
  className?: string
}) => {
  const { transfer, className } = props

  if (!transfer) {
    return (
      <div>
        <h1>entry not found</h1>
      </div>
    )
  }

  return (
    <div className={classNames(className, styles.transfersContainer)}>
      <div className={styles.transfer}>
        <p>{transfer.from}</p>
        <MdEast size={24} />
        <p>{transfer.to}</p>
      </div>
      <div className={styles.priceDistance}>
        <p className={styles.price}> &euro;{transfer.price} </p>
        <p>{transfer.distance}</p>
      </div>
    </div>
  )
}
