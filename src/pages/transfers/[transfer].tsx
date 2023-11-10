import { getEntriesByType } from '@/utils/contentful/contentful'
import { GetServerSideProps } from 'next'
import styles from './Transfer.module.css'
import Button from '@/components/simple/Button'

import TransfersCard from '@/components/simple/TransferCards'

type TransferFields = {
  from: string
  to: string
  price: number
  distance: string
}

export default function Page({
  transfer,
}: {
  transfer: { fields: TransferFields }
}) {
  if (!transfer) {
    return (
      <div>
        <h1>Transfer not found</h1>
      </div>
    )
  }

  return <TransfersCard transfer={transfer.fields} />
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const entries = await getEntriesByType('transfers')
  const transfer: any =
    entries?.find(
      (e: any) =>
        (e?.fields?.from + '-' + e?.fields?.to).toLocaleLowerCase() ===
        params?.transfer
    ) || null

  return {
    props: { transfer },
  }
}
