import { getAuth, signOut } from 'firebase/auth'
import { setSessionToken } from './session'
import { toast } from '@/components/simple/Toast/Toast'

const auth = getAuth()
export const signOutUser = () =>

  signOut(auth)
    .then(() => setSessionToken(null))
    .then(() => {
      window.location.href = '/authenticate'
    })
    .catch((error) => {
      console.error(error)
      toast.error('Sign-out failed. Please try again.')
    })
