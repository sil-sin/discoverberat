import { getAuth, signOut } from 'firebase/auth'
import app from '@/lib/firebase/client'
import { toast } from '@/components/ui/Toast'

export const clearSession = () => fetch('/api/session', { method: 'DELETE' })

export const signOutUser = () =>
  signOut(getAuth(app))
    .then(clearSession)
    .then(() => {
      window.location.href = '/'
    })
    .catch((error) => {
      console.error(error)
      toast.error('Sign-out failed. Please try again.')
    })
