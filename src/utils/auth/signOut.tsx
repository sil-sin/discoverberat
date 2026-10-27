import { getAuth, signOut } from 'firebase/auth'
import { setSessionToken } from './session'

const auth = getAuth()
export const signOutUser = () =>

  signOut(auth)
    .then(() => setSessionToken(null))
    .then(() => {
      window.location.href = '/authenticate'
    })
    .catch((error) => {
      console.error(error)
    })
