import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName });
    return user; // Return the user object after setting the display name
  } catch (error) {
    throw error; // Rethrow the error for handling in the component
  }
}
