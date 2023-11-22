import Button from '@/components/simple/Button'
import React from 'react'
import styles from './new.module.css'
import { useRouter } from 'next/router'

import { GetServerSidePropsContext } from 'next'
import { getEntriesByType, getEntry } from '@/utils/contentful/contentful'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import app from '@/utils/firebase/firebaseConfig'
import { useAuthContext } from '@/utils/auth/auth-provider'
function New({ booking }: any) {
  const { user } = useAuthContext()
  const router = useRouter()

  if (!booking || !user) return null

  const { title, price, currency = '€', description, url } = booking

  //Todo: Add function to utils to perform save items
  const handleSaveLater = async () => {
    const db = getFirestore(app)

    await addDoc(collection(db, 'savedBooking'), {
      ...booking,
      uid: user?.uid,
    })

    // Todo : Add notification
    console.log('Document successfully written!')
  }

  const handleBookNow = async () => {
    router.push(`/booking/new/payment?service=${url}`)
  }

  return (
    <div>
      <h2> {title} </h2>
      <p>
        {description?.split('.')[0]}.
        <Button className={styles.link} variant='link' href={`/tours/${url}`}>
          Read more
        </Button>
        <ul>
          Included :<li>item</li>
          <li>item</li>
          <li>item</li>
          <li>item</li>
          <li>item</li>
        </ul>
      </p>
      <div>Calendar here </div>
      <div className={styles.bookingOptions}>
        <div className={styles.bookOption}>
          <div>
            <h3>
              PRIVATE TOUR
              <br />
              {currency}
              {price}.00
              <br />
              PER PERSON
              <hr />
            </h3>
            <div>
              <p>Minimum booking requirement: 2 persons.</p>
              <hr />
              <p>Online payment option available for your convenience.</p>
            </div>
          </div>
          <Button variant='primary' onClick={handleBookNow}>
            Book Now
          </Button>
        </div>
        <div className={styles.bookOption}>
          <p>
            Reserve your spot on <b>{title}</b> for {currency}
            {price}/person (group tour).
            <br />
            <p>Individual bookings available with no minimum requirement.</p>
            <p>
              Please note: Price may decrease if more participants join. Online
              payment is not available for this option.
            </p>
          </p>
          <Button variant='primary' onClick={handleBookNow}>
            Reserve Now
          </Button>
        </div>

        <div className={styles.bookOption}>
          <p>
            Save for later (
            <em>This option will not reserve the selected service for you.</em>)
          </p>
          <Button onClick={handleSaveLater} variant='secondary'>
            Save for later
          </Button>
        </div>
      </div>
      <div>
        <br />
        <br />
      </div>
    </div>
  )
}

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const tourData: any =
    query.tour &&
    (await getEntriesByType('tourPage')).find(
      (tour) => tour.fields.url === query.tour
    )

  const serviceData =
    query.service &&
    (await getEntriesByType('serviceCard')).find(
      (service) => service.fields.url === query.service
    )

  if (serviceData) {
    return {
      props: {
        booking: { ...serviceData.fields, id: serviceData.sys.id },
      },
    }
  }

  return {
    props: {
      booking: { ...tourData.fields, id: tourData.sys.id },
    },
  }
}

export default New
