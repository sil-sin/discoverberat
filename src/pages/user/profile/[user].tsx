import { FC, useEffect, useState } from 'react'
import styles from './user.module.css'
import Image from 'next/image'

import Dashboard from '@/components/Dashboard/Dashboard'
import AdminDashboard from '@/components/AdminDashboard/AdminDashboard'
import {
  getFirestore,
  collectionGroup,
  query,
  getDocs,
} from 'firebase/firestore'
import { useAuthContext } from '@/utils/auth/auth-provider'
import app from '@/utils/firebase/firebaseConfig'

const ProfilePage: FC = () => {
  const { user, loading } = useAuthContext()
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([])
  const [savedItems, setSavedItems] = useState<any[]>([])

  useEffect(() => {
    if (!user || loading) return

    const fetchBookings = async () => {
      try {
        const db = getFirestore(app)
        const bookingQuery = query(collectionGroup(db, 'bookings'))
        const bookingSnapshot = await getDocs(bookingQuery)

        const bookingData: any[] = []
        bookingSnapshot.forEach((doc) => {
          const data = doc.data()
          const timestamp = data.date
          const date = new Date(timestamp.seconds * 1000)

          if (date < new Date()) return
          if (
            user.uid === process.env.NEXT_PUBLIC_ADMIN_ID ||
            user.uid === data.uid
          ) {
            bookingData.push({ ...data, date })
          }
        })

        // Sort by date
        bookingData.sort((a, b) => a.date - b.date)
        setUpcomingBookings(bookingData)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }

    const fetchSavedItems = async () => {
      try {
        const db = getFirestore(app)
        const savedItemsQuery = query(collectionGroup(db, 'savedBooking'))
        const savedItemsSnapshot = await getDocs(savedItemsQuery)

        const items: any[] = []
        savedItemsSnapshot.forEach((doc) => {
          const data = doc.data()
          if (user.uid === data.uid) {
            items.push(data)
          }
        })
        setSavedItems(items)
      } catch (error) {
        console.error('Error fetching saved items:', error)
      }
    }

    fetchBookings()
    fetchSavedItems()
  }, [user, loading])

  if (loading) {
    return <p>Loading...</p>
  }


  if (!user) {
    return <p>User is not authenticated.</p>

  }

  return (
    <div className={styles.container}>
      <div className={styles.userContainer}>
        <div className={styles.userInfo}>
          <Image
            src={user.photoURL ? user.photoURL : '/avatar.svg'}
            alt={user.displayName ?? 'Profile Picture'}
            width={50}
            height={50}
          />
          <h2 className={styles.title}>
            {'Welcome, ' + (user.displayName || '')}
          </h2>
        </div>
        {user.uid === process.env.NEXT_PUBLIC_ADMIN_ID ? (
          <AdminDashboard bookings={upcomingBookings} user={user} />
        ) : (
          <Dashboard
            bookings={upcomingBookings}
            savedItems={savedItems}
            user={user}
          />
        )}
      </div>
    </div>
  )
}

export default ProfilePage
