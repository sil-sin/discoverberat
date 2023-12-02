import React, { useState } from 'react'
import styles from './new.module.css'
import Button from '../../../components/simple/Button/index'
import PaypalCheckoutButton from '@/utils/payment/paypal'

export default function Payment({ service }: any) {
  const [disableCheckout, setDisableCheckout] = useState(true)

  const onSuccess = (success: boolean) => {
    setDisableCheckout(!success)
  }

  if (disableCheckout) {
    console.log('true')
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
          console.log('clicked')
        }}
        isDisabled={disableCheckout}
      >
        Proceed to checkout
      </Button>
      <sup>Please select a payment method</sup>
    </div>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {
      service: {
        title: 'test',
        price: 1,
        uid: 'test',
      },
    },
  }
}
