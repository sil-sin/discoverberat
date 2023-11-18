import Button from '@/components/simple/Button'
import React from 'react'
import styles from './new.module.css'
export default function New() {
  const price = '50$'
  return (
    <div>
      <h2> Booking name </h2>

      <p>Booking description</p>
      <p>Duration</p>

     < div className={styles.bookingOptions}>
         <div>
           <p>Book now with online payment </p>
           <Button variant='primary'>Book for {price}</Button>
         </div>
         <div>
           <p>Reserve your spot now and pay directly at our physical office </p>
           <Button variant='secondary'>Reserve now , pay later</Button>
         </div>
         <div>
           <p>
             Save for later (
             <em>
               This option will not reserve the selected service / tour for you.
             </em>
             ){' '}
           </p>
           <Button variant='secondary'>Save for later</Button>
         </div>
     </ div >
    </div>
  )
}
