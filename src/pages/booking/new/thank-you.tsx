import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getFirestore, doc, getDoc, DocumentData } from 'firebase/firestore'
import styles from './thank-you.module.css'
import Button from '@/components/simple/Button'
import { useAuthContext } from '@/utils/auth/auth-provider'

export default function ThankYouPage() {
  const router = useRouter()
  const id = (router.query.id as string) || ''
  const db = getFirestore()
  const [booking, setBooking] = useState<DocumentData | null>(null)
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchBooking = async () => {
      if (db && id) {
        const docRef = doc(db, 'bookings', id)

        try {
          const docSnapshot = await getDoc(docRef)

          if (docSnapshot.exists()) {
            const data = docSnapshot.data() as DocumentData
            setBooking(data)
          } else {
            console.log('Document does not exist')
            setBooking(null)
          }
        } catch (error) {
          console.error('Error fetching document:', error)
        }
      }
    }

    fetchBooking()
  }, [db, id])

  if (!booking) {
    return <p>Loading...</p>
  }

  const formattedDate = booking.date.toLocaleString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const formatedBookingTitle = booking.title.includes(booking.type)
    ? booking.title
        .split(' ')
        .filter((char: string) => char !== booking.type)
        .join(' ')
    : booking.title

  return (
    <div className={styles.container}>
      {booking && (
        <div className={styles.detailsContainer}>
          <h3 className={styles.title}>Thank you for your booking! </h3>
          <section>
            You have booked{' '}
            <strong>
              {formatedBookingTitle} {booking.type}
            </strong>
            , for a total price of{' '}
            <strong>
              {booking.currency}
              {booking.price * booking.guestNumber}
            </strong>{' '}
            for {booking.guestNumber} guest
            {booking.guestNumber === 1 ? '' : 's'} (
            {booking.currency + booking.price} per person).
            <div>
              Starting on{' '}
              <strong>
                {
                  // TODO : Add to calendar
                }
                {formattedDate}
              </strong>
              .<p>See you soon!</p>
            </div>
          </section>
          <Button
            variant='primary'
            onClick={() =>
              router.push(`/${booking.type === 'tour' ? 'tours' : '/'}`)
            }
            text='Book another'
          />
          <Button
            variant='secondary'
            onClick={() => router.push('/user/profile/' + user?.displayName)}
            text='See all bookings'
          />
        </div>
      )}
    </div>
  )
}
