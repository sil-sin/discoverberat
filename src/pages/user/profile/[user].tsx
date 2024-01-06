import { FC } from 'react'
import styles from './user.module.css'

import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import Image from 'next/image'
import { adminSDK } from '@/pages/api/adminConfig'
import { getFirestore } from 'firebase-admin/firestore'

import Button from '@/components/simple/Button'

const ProfilePage: FC = ({ user, savedItems, data }: any) => {
  if (!user) {
    return null
  }
  const upcomingBookings = data && data.sort((a: any, b: any) => {
    // Convert date strings to Date objects
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Compare the dates
    return dateA.getTime() - dateB.getTime();
  })[0]
  console.log(user.picture);
  return (
    <div className={styles.container}>
      <div className={styles.userContainer}>
        <div className={styles.userInfo}>
          <Image src={!!user.picture ? user.picture : '/avatar.svg'} alt={user.name} width={50} height={50} />
          <h1 className={styles.title}>{'Welcome, ' + user?.name || ''}</h1>
        </div>

        {data.length ? <div>Upcoming booking:
          <p>{upcomingBookings.title} </p>
          <p>{upcomingBookings.date}</p>
        </div>

          : <p> 'No upcoming booking'</p>}
      </div>

      <div className={styles.myItemsContainer}>
         <div className={styles.bookingsContainer}>
        <h2>Bookings</h2>
        {data.length ? (
          <ul className={styles.bookingsList}>
            {data.map((item: any) => (
              <li key={item.id}>
                <p>
                  You have booked <q>{item.title}</q> {item.type}
                </p>
                <p>
                  Price of the booking :{item.currency}
                  {item.price}{' '}
                  <span>({item.isPaid ? 'Paid' : 'Pay on location'})</span>
                </p>
                <p>For {item.guestNumber} guest(s)</p>
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
          <p>
            You have no bookings
            <Button variant='link' href='/tours'>
              Book a tour
            </Button>
          </p>
        )}
      </div>
        <div className={styles.savedItems}>
          <h2>Saved items</h2>
          {savedItems.length ? (
            <ul>
              {savedItems.map((item: any) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
          ) : (
            <p>You have no saved items</p>
          )}
        </div></div>
    </div >
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

    //Todo: Add logic for duplicate saved items
    //Todo: Add logic for delete saved items
    //Todo: Move them to utils functions

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
