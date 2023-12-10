import app from '@/utils/firebase/firebaseConfig'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

export const fetchData = async (collectionName: string) => {
  const db = getFirestore(app)

  const collectionRef = collection(db, collectionName)

  try {
    const querySnapshot = await getDocs(collectionRef)

    const dateCountMap = new Map()

    querySnapshot.forEach((doc) => {
      const date = doc.data().date

      if (dateCountMap.has(date)) {
        dateCountMap.set(date, dateCountMap.get(date) + 1)
      } else {
        dateCountMap.set(date, 1)
      }
    })

    const filteredDates = Array.from(dateCountMap.entries())
      .filter(([date, count]) => count >= 2)
      .map(([date]) => date)
    return filteredDates
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}
