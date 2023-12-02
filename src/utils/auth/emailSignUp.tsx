import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'

export const signUpWithEmail = (
  email: string,
  password: string,
  displayName: string
) => {
  const auth = getAuth()
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user
      await updateProfile(user, { displayName })
    })
    .catch((error) => {
      return error
    })
}
