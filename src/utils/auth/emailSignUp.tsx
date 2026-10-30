import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import app from '../firebase/firebaseConfig'

let profileReady: Promise<void> = Promise.resolve()

// The sign-in event fires before updateProfile, so AuthProvider waits for this to publish the user with a name.
export const waitForProfile = () => profileReady

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  let markReady = () => {}
  profileReady = new Promise((resolve) => (markReady = resolve))
  try {
    const { user } = await createUserWithEmailAndPassword(getAuth(app), email, password);
    await updateProfile(user, { displayName });
    return user;
  } finally {
    markReady();
  }
}
