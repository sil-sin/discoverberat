import React, { FC } from 'react'
import styles from './TransferCard.module.css'
import { MdEast } from 'react-icons/md'

export const TransfersCard: FC<any> = (props: { transfer: any }) => {
  const { transfer } = props

  if (!transfer) {
    return (
      <div>
        <h1>entry not found</h1>
      </div>
    )
  }

  return (
    <div className={styles.transfersContainer}>
      <div className={styles.transfer}>
        <p>{transfer.from}</p>
        <MdEast size={24}  />
        <p>{transfer.to}</p>
      </div>
      <div className={styles.priceDistance}>
        <p> &euro;{transfer.price} </p>
        <span></span>
        <p>{transfer.distance}</p>
      </div>
    </div>
  )
}
