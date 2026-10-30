import { getAuth, signOut } from 'firebase/auth'
import app from '@/lib/firebase/client'
import { setSessionToken } from './session'
import { toast } from '@/components/ui/Toast'

export const signOutUser = () =>
  signOut(getAuth(app))
    .then(() => setSessionToken(null))
    .then(() => {
      window.location.href = '/'
    })
    .catch((error) => {
      console.error(error)
      toast.error('Sign-out failed. Please try again.')
    })
