import React, { useState, useEffect } from 'react'
import styles from './user.module.css'

import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import Image from 'next/image'
import { adminSDK } from '@/pages/api/adminConfig'
import { getFirestore } from 'firebase-admin/firestore'
import { table } from 'console'

const ProfilePage = ({ user, savedItems, data }: any) => {
  if (!user) {
    return null
  }

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
            {data.map((item: any) => (
              <li key={item.id}>
                <p>
                  You have booked the {item.title} {item.type}
                </p>
                <p>
                  Price of the booking : {item.price} (
                  {item.paid ? 'Paid' : 'Payment pending'})
                </p>
                <p>
                  Starts at :
                  <span>
                    {new Date(item?.date).toLocaleString('en-US', {
                      timeZoneName: 'short',
                    })}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no bookings</p>
        )}
      </div>
      <div className={styles.savedItems}>
        <h2>Saved items</h2>
        {savedItems ? (
          <ul>
            {savedItems.map((item: any) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        ) : (
          <p>You have no saved items</p>
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

    const bookingQuery = db.collectionGroup('bookings')
    const savedItemsQuery = db.collectionGroup('savedBooking')

    let data: FirebaseFirestore.DocumentData[] = []

    //Todo: Add logic for duplicate bookings

    await bookingQuery.get().then((querySnapshot) => {
      return querySnapshot.forEach((documentSnapshot) => {
        authenticatedUser.uid === documentSnapshot.data().uid &&
          data.push(documentSnapshot.data())
      })
    })

    const savedItems: any[] = []
    await savedItemsQuery.get().then((querySnapshot) => {
      return querySnapshot.forEach((documentSnapshot) => {
        authenticatedUser.uid === documentSnapshot.data().uid
          ? savedItems.push(documentSnapshot.data())
          : null
      })
    })

    return {
      props: {
        user: authenticatedUser,
        data,
        savedItems: savedItems || null,
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
