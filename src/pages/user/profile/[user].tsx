import { FC } from 'react'
import styles from './user.module.css'

import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import Image from 'next/image'
import { adminSDK } from '@/pages/api/adminConfig'
import { getFirestore } from 'firebase-admin/firestore'

import Dashboard from '@/components/Dashboard/Dashboard'

const ProfilePage: FC = ({ user, savedItems, data }: any) => {
  if (!user || !data) {
    return null
  }

  const upcomingBookings =
    data &&
    data.sort((a: any, b: any) => {
      // Convert date strings to Date objects
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)

      // Compare the dates
      return dateA.getTime() - dateB.getTime()
    })



  return (
    <div className={styles.container}>
      <div className={styles.userContainer}>
        <div className={styles.userInfo}>
          <Image
            src={!!user.picture ? user.picture : '/avatar.svg'}
            alt={user.name}
            width={50}
            height={50}
          />
          <h2 className={styles.title}>{'Welcome, ' + user?.name || ''}</h2>
        </div>
        <Dashboard
          bookings={upcomingBookings}
          savedItems={savedItems}
          user={user}
        />
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const CACHE_TIME_SECONDS = 12 * 60 * 60 // 12 hours
  // Set caching headers for the response
  ctx.res.setHeader(
    'Cache-Control',
    `public, s-maxage=${CACHE_TIME_SECONDS}, stale-while-revalidate=59`
  )

  try {
    const cookies = nookies.get(ctx)
    const authenticatedUser = await adminSDK.auth().verifyIdToken(cookies.token)

    if (
      ctx.params?.user !==
      authenticatedUser.uid
    ) {
      return {
        redirect: {
          destination:
            '/user/profile/' +
            authenticatedUser.uid,
          permanent: false,
        },
      }
    }

    const db = getFirestore()

    const bookingQuery = db.collectionGroup('bookings')
    const savedItemsQuery = db.collectionGroup('savedBooking')

    let data: FirebaseFirestore.DocumentData[] = []

    //Todo: Add logic for duplicate saved items
    //Todo: Add logic for delete saved items
    //Todo: Move them to utils functions
    await bookingQuery.get().then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        const bookingData = documentSnapshot.data();
        if (authenticatedUser.uid === bookingData.uid) {
          // Convert Firestore Timestamp to JavaScript Date
          const timestamp = bookingData.date;
          const date = new Date(timestamp._seconds * 1000);

          // Format date as a string (adjust formatting as needed)
          const dateString = date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }); // Or any other desired format

          // Add formatted date to bookingData and push it to the data array
          data.push({ ...bookingData, date: dateString });
        }
      });
    });


    const savedItems: any[] = []
    await savedItemsQuery.get().then((querySnapshot) => {
      return querySnapshot.forEach((documentSnapshot) => {
        authenticatedUser.uid === documentSnapshot.data().uid
          ? savedItems.push(documentSnapshot.data())
          : null
      })
    })
    console.log(data);
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
