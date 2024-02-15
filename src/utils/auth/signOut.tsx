import { getAuth, signOut } from 'firebase/auth'
import nookies from 'nookies'

const auth = getAuth()
export const signOutUser = () =>
  
  signOut(auth)
    .then(() => {
      window.location.href = '/authenticate'
      nookies.destroy(null, 'token')
    })
    .catch((error) => {
      console.error(error)
    })
