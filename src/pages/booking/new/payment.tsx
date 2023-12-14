import React, { useState } from 'react'
import styles from './new.module.css'
import Button from '../../../components/simple/Button/index'
import PaypalCheckoutButton from '@/utils/payment/paypal'
import { getEntry } from '@/utils/contentful/contentful'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import app from '@/utils/firebase/firebaseConfig'
import { useAuthContext } from '@/utils/auth/auth-provider'
import { useRouter } from 'next/router'

export default function Payment({ service }: any) {
  const [disableCheckout, setDisableCheckout] = useState(true)
  const router = useRouter()
  const onSuccess = async (data: any) => {
    console.log(data)
    const db = getFirestore(app)
    await addDoc(collection(db, 'bookings'), {
      ...data,
    })
    setDisableCheckout(!data)
  }

  return (
    <div>
      <div className={styles.paypal}>
        {disableCheckout && (
          <PaypalCheckoutButton products={service} onSubmit={onSuccess} />
        )}
      </div>
      <div>Pay now </div>
      <div className={styles.pay}>Reserve your spot now and pay latter</div>
      <Button
        className={styles.button}
        variant='primary'
        onClick={() => {
          router.replace('/user/profile/user')
        }}
        isDisabled={disableCheckout}
      >
        Booking details
      </Button>
      <sup>Please select a payment method</sup>
    </div>
  )
}

export const getServerSideProps = async (params: any) => {
  const service = params.query
  const bookingEntry = await getEntry(service.bookingId, {
    content_type: service.type === 'tour' ? 'tourPage' : 'serviceCard',
    select: 'fields.price',
  })
  const price = bookingEntry.fields.price
  return {
    props: { service: { ...service, price } },
  }
}
