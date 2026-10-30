import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth'
import app from '@/lib/firebase/client'

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
    // Booking needs a verified email; a failed send is retried from the booking page.
    sendEmailVerification(user).catch(console.error);
    return user;
  } finally {
    markReady();
  }
}
