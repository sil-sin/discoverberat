import Button from '@/components/simple/Button'
import React from 'react'
import styles from './new.module.css'
import { useRouter } from 'next/router'

import { GetServerSidePropsContext } from 'next'
import { getEntriesByType, getEntry } from '@/utils/contentful/contentful'
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from 'firebase/firestore'
import app from '@/utils/firebase/firebaseConfig'
import { useAuthContext } from '@/utils/auth/auth-provider'
function New({ booking }: any) {
  const { user } = useAuthContext()
  if (!booking || !user) return null



  const { title, price, currency = '€', description, url } = booking

  const handleSaveLater = async () => {

    const db = getFirestore(app)

    // Assuming 'user' is a variable containing user information, and you want to associate the UID with the saved booking.
    await addDoc(collection(db, 'savedBooking'), {
      ...booking,
      uid: user?.uid,
    })

    // You might want to handle success or provide feedback to the user.
    console.log('Document successfully written!')
  }

  return (
    <div>
      <h2> {title} </h2>
      <p>
        {description?.split('.')[0]}.
        <Button className={styles.link} variant='link' href={`/tours/${url}`}>
          Read more
        </Button>
      </p>

      <div className={styles.bookingOptions}>
        <div className={styles.bookOption}>
          <p>Book now with online payment </p>
          <Button variant='primary'>
            Book for {currency}
            {price}
          </Button>
        </div>
        <div className={styles.bookOption}>
          <p>Reserve your spot now and pay directly at our physical office </p>
          <Button variant='secondary'>Reserve now , pay later</Button>
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
