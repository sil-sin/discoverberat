import React, { FC } from 'react'
import styles from './Transfers.module.css'
import TransfersCard from '@/components/simple/TransferCards'

export const Transfers: FC<any> = (props: any) => {
  console.log(props.transfers)

  if (!props.transfers) {
    return (
      <div>
        <h1>entry not found</h1>
      </div>
    )
  }

  return (
    <div className={styles.transfersContainer}>
      {props.transfers.map((transfer: any) => (
        <div key={transfer.sys.id}>
          <TransfersCard transfer={transfer.fields} />
        </div>
      ))}
    </div>
  )
}
