import { toast } from '@/components/ui/Toast'

export const clearSession = () => fetch('/api/session', { method: 'DELETE' })

export const signOutUser = () =>
  Promise.all([import('firebase/auth'), import('@/lib/firebase/client')])
    .then(([{ getAuth, signOut }, { default: app }]) => signOut(getAuth(app)))
    .then(clearSession)
    .then(() => {
      window.location.href = '/'
    })
    .catch((error) => {
      console.error(error)
      toast.error('Sign-out failed. Please try again.')
    })
