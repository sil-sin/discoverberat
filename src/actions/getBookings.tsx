'use server'

import { getFirestore } from 'firebase-admin/firestore'

export const getBookings = async (user: any) => {
  const db = getFirestore()
  const bookingQuery = db.collectionGroup('bookings')

  // Define an array to store matching bookings
  const bookings: FirebaseFirestore.DocumentData[] = []

  const querySnapshot = await bookingQuery.get()

  querySnapshot.forEach((documentSnapshot) => {
    const bookingData = documentSnapshot.data()
    const timestamp = bookingData.date
    const date = new Date(timestamp._seconds * 1000)

    if (
      date >= new Date() &&
      (user.uid === bookingData.uid || user.uid === process.env.ADMIN_ID)
    ) {
      bookingData.date = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })

      bookings.push(bookingData)
    }
  })

  return bookings
}
