import React, { useState, useEffect } from 'react'
import styles from './user.module.css'

import withLayout from '@/utils/auth/withLayout'

import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import Image from 'next/image'
import { adminSDK } from '@/pages/api/adminConfig'

import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'
import app from '@/utils/firebase/firebaseConfig'

const ProfilePage = ({ user }: any) => {
  const [data, setData] = useState<{ id: string; [key: string]: any }[]>([])
  const db = getFirestore(app)

  useEffect(() => {
    const getDb = async () => {
      try {
        // Create a query to filter documents based on the 'uid' field
        const q = query(
          collection(db, 'bookings'),
          where('uid', '==', user.uid)
        )

        const querySnapshot = await getDocs(q)

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setData(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    getDb()
  }, [db, user.uid])

  const dateTime = new Date(data[0]?.date)
  return (
    <div className={styles.container}>
      <div className={styles.userContainer}>
        <Image src={user?.picture} alt={user.name} width={50} height={50} />
        <h1 className={styles.title}>{'Welcome, ' + user?.name || ''}</h1>
        <p>{'Logged in with ' + user?.firebase?.sign_in_provider || ''}</p>
        <p className={styles.email}>{'Email: ' + user?.email || ''}</p>
      </div>

      <div className={styles.bookingsContainer}>
        <h2>Bookings</h2>
        <ul>
          <li key={data[0]?.id}>
            <h3>{data[0]?.title}</h3>
            <p>{data[0]?.type}</p>
            <p>{data[0]?.price}</p>
            <p>
              Starts at :
              <span>
                {dateTime.toLocaleString('en-US', { timeZoneName: 'short' })}
              </span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const cookies = nookies.get(ctx)
    const authenticatedUser = await adminSDK.auth().verifyIdToken(cookies.token)

    return {
      props: {
        user: authenticatedUser,
      },
    }
  } catch (error) {
    console.error('Error in getServerSideProps:', error)

    ctx.res.writeHead(302, { Location: '/' })
    ctx.res.end()

    return {
      props: {
        error: 'Authentication failed. ' + error,
      },
    }
  }
}

export default withLayout(ProfilePage, true, 'Profile')
