import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/utils/auth/auth-provider'
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from 'firebase/firestore'
import { toast } from '@/components/simple/Toast'

type SavedTour = {
  id: string
  title: string
  price: number
  currency?: string
  url: string
}

const useSaveLater = ({ id, title, price, currency = '€', url }: SavedTour) => {
  const { user } = useAuthContext()
  const router = useRouter()

  const handleSaveLater = async () => {
    if (!user) {
      const here = window.location.pathname + window.location.search
      return router.push('/authenticate?callbackUrl=' + encodeURIComponent(here))
    }

    const db = getFirestore()

    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'savedBooking'), where('uid', '==', user.uid))
      )
      const link = { label: 'View saved tours', href: '/user/profile/' + user.uid }
      if (querySnapshot.docs.some((doc) => doc.data().id === id)) {
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
    }
  }

  return { handleSaveLater }
}

export default useSaveLater
