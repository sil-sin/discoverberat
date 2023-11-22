import React from 'react'
import styles from './new.module.css'
import Button from '../../../components/simple/Button/index'
export default function payment() {
  return (
    <div>
      <div className={styles.pay}></div>
      <div>Pay now </div>
      <div className={styles.pay}>Reserve your spot now and pay latter</div>
      <Button
        className={styles.button}
        variant='primary'
        onClick={() => {
          console.log('clicked')
        }}
        isDisabled={true}
      >
        Proceed to checkout
      </Button>
      <sup>Please select a payment method</sup>
    </div>
  )
}
