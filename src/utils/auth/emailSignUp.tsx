import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  const { user } = await createUserWithEmailAndPassword(getAuth(), email, password);
  await updateProfile(user, { displayName });
  return user;
}
