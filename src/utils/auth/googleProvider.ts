import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import app from '../firebase/firebaseConfig'
import { useRouter } from 'next/router'

export const googleProvider = () => {
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)

      const token = credential?.accessToken
      const user = result.user
      console.log(result)

      const { callbackUrl } = JSON.parse(window.location.search)
      window.location.replace(
        callbackUrl
          ? JSON.stringify(callbackUrl)
          : '/user/profile/' +
              user.displayName?.split(' ').join('-').toLowerCase()
      )
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      // ...
      console.error(errorCode, errorMessage)
    })
}
