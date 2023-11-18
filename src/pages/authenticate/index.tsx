import { signUpWithEmail } from '@/utils/auth/emailSignUp'
import { useAuthContext } from '@/utils/auth/auth-provider'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { Url } from 'next/dist/shared/lib/router/router'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const AuthPage = () => {
  const router = useRouter()
  const { user, loading } = useAuthContext()
  useEffect(() => {
    const callbackUrl = router.query.callback as Url

    if (user) {
      const profilePath = user.displayName?.split(' ').join('-').toLowerCase()


      router.push(callbackUrl ?? '/user/profile/' + profilePath)
    }
  }, [router, router.query.callback, user])

  return (
    <div>
      <h3>Login</h3>
      <form
        action=''
        method='post'
        onSubmit={(e: any) => {
          e.preventDefault()
          signUpWithEmail(
            e.target.email.value,
            e.target.password.value,
            e.target.displayName.value
          )
        }}
      >
        <label htmlFor='displayName'>Display Name</label>
        <input
          type='text'
          name='displayName'
          id='displayName'
          placeholder='First and Last Name'
        />
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          name='email'
          id='email'
          placeholder='ie. name@example.com'
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='password'
          id='password'
          placeholder='Password'
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}
export default AuthPage
