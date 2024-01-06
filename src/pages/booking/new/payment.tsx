import React, { useState } from 'react'
import styles from './new.module.css'
import Button from '../../../components/simple/Button/index'
import PaypalCheckoutButton from '@/utils/payment/paypal'
import { getEntry } from '@/utils/contentful/contentful'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import app from '@/utils/firebase/firebaseConfig'
import { useAuthContext } from '@/utils/auth/auth-provider'
import { useRouter } from 'next/router'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { config } from 'process'

export default function Payment({ service }: any) {
  const [disableCheckout, setDisableCheckout] = useState(true)
  const router = useRouter()
  const { price, currency, guestNumber, title, type } = service
  const priceWithCurrency = currency + price
  const totalPrice = currency + price * guestNumber

  const onSuccess = async (data: any) => {
    const db = getFirestore(app)
    console.log('sil:', { data })

    await addDoc(collection(db, 'bookings'), {
      ...data,
    }).then((res) => router.push('thank-you?id=' + res.id))
    setDisableCheckout(!data)
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId:
          process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
      }}
    >
      <div className={styles.paymentContainer}>
        <h3 className={styles.pay}>Booking details</h3>
        <em>
          ! Please check your booking details before choosing a payment method
        </em>
        <div className={styles.bookingDetailsTable}>
          <table>
            <thead>
              <tr>
                <th>Booking</th>
                <th>Price per person</th>
                <th>Guest(s)</th>
                <th>Total price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{title}</td>
                <td>{priceWithCurrency}</td>
                <td>{guestNumber}</td>
                <td>{totalPrice}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.paypal}>
          <p>Select a payment method</p>
          {disableCheckout && (
            <PaypalCheckoutButton products={service} onSubmit={onSuccess} />
          )}
        </div>

        {/* <Button
        className={styles.button}
        variant='primary'
        onClick={() => {
          router.replace('/user/profile/user')
        }}
        isDisabled={disableCheckout}
      >
        Done
      </Button> */}
      </div>
    </PayPalScriptProvider>
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
