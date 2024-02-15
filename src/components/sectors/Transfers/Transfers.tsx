import React, { FC } from 'react'
import styles from './Transfers.module.css'
import TransfersCard from '@/components/simple/TransferCards'
import Link from 'next/link'

export const Transfers: FC<any> = (props: any) => {
  if (!props.transfers) {
    return (
      <div>
        <h1>entry not found</h1>
      </div>
    )
  }

  return (
    <>
      <div className={styles.transfersContainer}>
        <h2 className={styles.transfersTitle}>Transfers</h2>
        <div className={styles.transfersCardsContainer}>
          {props.transfers.map((transfer: any) => (
            <Link
              className={styles.transferCard}
              href={{
                hash: 'contact',
                query: { transfer: transfer.fields.to },
              }}
              // href={'#contact?transfer=' + transfer.fields.to}
              key={transfer.sys.id}
            >
              <TransfersCard
                className={styles.transferCard}
                transfer={transfer.fields}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
