import { useRouter } from 'next/router'
import { useAuthContext } from '@/utils/auth/auth-provider'
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from 'firebase/firestore'
import { useState } from 'react'

const useSaveLater = (booking: any, url: string) => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const { user } = useAuthContext()
  const router = useRouter()

  const handleSaveLater = async () => {
    if (!user) {
      return router.replace(
        '/authenticate?callbackUrl=/booking/new?tour=' + url
      )
    }

    const db = getFirestore()

    try {
      // Check if a document with the same content exists
      const querySnapshot = await getDocs(
        query(collection(db, 'savedBooking'), where('uid', '==', user.uid))
      )

      //find by id
      const existingBooking = querySnapshot.docs.find((doc) => {
        return doc.data().id === booking.id
      })

      if (existingBooking) {
        console.warn('Duplicate document found. Not saving.')
        setIsSuccess(false)
        setIsTouched(true)
        // No existing document found, proceed to save
      } else {
        // Document with the same content already exists
        await addDoc(collection(db, 'savedBooking'), {
          ...booking,
          uid: user.uid,
        })
        setIsSuccess(true)
        router.push('#success')
      }
    } catch (error) {
      console.error('Error saving booking:', error)
    }
  }

  return { handleSaveLater, isSuccess, isTouched }
}

export default useSaveLater
