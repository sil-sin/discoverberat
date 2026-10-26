import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import app from '../firebase/firebaseConfig'

export const googleProvider = () => {
  signInWithPopup(getAuth(app), new GoogleAuthProvider()).catch((error) => {
    console.error(error.code, error.message)
  })
}
