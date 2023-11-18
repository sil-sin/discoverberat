import React, { useState, useEffect } from 'react'
import styles from './user.module.css'

import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import Image from 'next/image'
import { adminSDK } from '@/pages/api/adminConfig'
import { getFirestore } from 'firebase-admin/firestore'

const ProfilePage = ({ user, error, data }: any) => {
  if (!user) {
    return null
  }

  const dateTime = new Date(data?.date)

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
        {data ? (
          <ul>
            <li key={data.id}>
              <p>
                You have booked the {data.title} {data.type}
              </p>
              <p>
                Price of the booking : {data.price} (
                {data.paid ? 'Paid' : 'Payment pending'})
              </p>
              <p>
                Starts at :
                <span>
                  {dateTime.toLocaleString('en-US', { timeZoneName: 'short' })}
                </span>
              </p>
            </li>
          </ul>
        ) : (
          <p>You have no bookings</p>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx)
    const authenticatedUser = await adminSDK.auth().verifyIdToken(cookies.token)

    if (
      ctx.params?.user !==
      authenticatedUser.name.split(' ').join('-').toLowerCase()
    ) {
      return {
        redirect: {
          destination:
            '/user/profile/' +
            authenticatedUser.name.split(' ').join('-').toLowerCase(),
          permanent: false,
        },
      }
    }

    const db = getFirestore()

    const query = db.collectionGroup('bookings')
    let data = null
    await query.get().then((querySnapshot) => {
      return querySnapshot.forEach((documentSnapshot) => {
        data =
          authenticatedUser.uid === documentSnapshot.data().uid
            ? documentSnapshot.data()
            : null
      })
    })

    return {
      props: {
        user: authenticatedUser,
        data,
      },
    }
  } catch (error) {
    ctx.res.writeHead(302, {
      Location: '/authenticate?callback=' + ctx.req.url,
    })
    ctx.res.end()
    return {
      props: {
        error: 'Authentication failed. ' + error,
      },
    }
  }
}

export default ProfilePage
