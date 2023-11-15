import { getAuth, signOut } from 'firebase/auth'
import nookies from 'nookies'

const auth = getAuth()
export const signOutUser = () =>
  signOut(auth)
    .then(() => {
      nookies.destroy(null, 'token')
      window.location.reload()
    })
    .catch((error) => {
      console.log(error)
    })
