'use server'
import { getFirestore } from 'firebase-admin/firestore'

export async function getSavedItems(userId: string) {
  const db = getFirestore()
  const bookingQuery = db.collectionGroup('savedBooking')

  // Define an array to store matching bookings
  const savedItems: FirebaseFirestore.DocumentData[] = []

  const querySnapshot = await bookingQuery.get()

  querySnapshot.forEach((documentSnapshot) => {
    const bookingData = documentSnapshot.data()

    if (userId === bookingData.uid) {
      savedItems.push(bookingData)
    }
  })

  return savedItems
}
