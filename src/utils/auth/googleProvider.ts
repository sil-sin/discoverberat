import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import app from '../firebase/firebaseConfig'

const CLOSED_BY_USER = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request']

// Resolves to an error message for the user, or null when signed in or cancelled.
export const googleProvider = () =>
  signInWithPopup(getAuth(app), new GoogleAuthProvider())
    .then(() => null)
    .catch((error) => {
      if (CLOSED_BY_USER.includes(error.code)) return null
      console.error(error.code, error.message)
      return error.code === 'auth/popup-blocked'
        ? 'Your browser blocked the Google window. Allow pop-ups and try again.'
        : 'Google sign-in failed. Please try again.'
    })
