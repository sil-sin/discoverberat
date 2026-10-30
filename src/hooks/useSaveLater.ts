import { useState } from 'react'
import { useAuthContext } from '@/lib/auth/auth-provider'
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  limit,
  addDoc,
} from 'firebase/firestore'
import { toast } from '@/components/ui/Toast'

type SavedTour = {
  id: string
  title: string
  price: number
  currency?: string
  url: string
}

const useSaveLater = ({ id, title, price, currency = '€', url }: SavedTour) => {
  const { user, openAuth } = useAuthContext()
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveLater = async () => {
    if (!user) return openAuth('save')
    if (isSaving) return

    const db = getFirestore()
    setIsSaving(true)

    try {
      const saved = await getDocs(
        query(
          collection(db, 'savedBooking'),
          where('uid', '==', user.uid),
          where('id', '==', id),
          limit(1)
        )
      )
      const link = { label: 'View saved tours', href: '/user/profile/' + user.uid }
      if (!saved.empty) {
        return toast.info('This tour is already saved.', link)
      }

      await addDoc(collection(db, 'savedBooking'), {
        id,
        title,
        price,
        currency,
        url,
        uid: user.uid,
      })
      toast.success('Tour saved for later.', link)
    } catch (error) {
      console.error('Error saving booking:', error)
      toast.error('This tour could not be saved. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return { handleSaveLater, isSaving }
}

export default useSaveLater
