import { useAuthContext } from '@/utils/auth/auth-provider'

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import SignUp from '@/components/Authentication/SignUp'
import styles from './auth.module.css'
import { googleProvider } from '@/utils/auth/googleProvider'
import Button from '@/components/simple/Button'
import Image from 'next/image'
import SignIn from '@/components/Authentication/SignIn'
import classNames from 'classnames'

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(true)

  const router = useRouter()
  const { user, loading } = useAuthContext()

  useEffect(() => {
    const callbackUrl = router.query.callbackUrl as string

    if (user) {
      const profilePath =
        '/user/profile/' + user.displayName?.split(' ').join('-').toLowerCase()

      router.push((callbackUrl as string) ?? profilePath)
    }
  }, [router, router.query.callback, user])

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.tabButtons}>
          <Button
            onClick={() => setIsSignUp(true)}
            text='Sign Up'
            className={classNames(
              {
                [styles.active]: isSignUp,
                [styles.disabled]: loading,
                [styles.leftTabButton]: !isSignUp,
              },
              styles.tabButton
            )}
          />
          <Button
            onClick={() => setIsSignUp(false)}
            text='Sign In'
            className={classNames(
              {
                [styles.active]: !isSignUp,
                [styles.disabled]: loading,
                [styles.rightTabButton]: isSignUp,
              },
              styles.tabButton
            )}
          />
        </div>
        {isSignUp ? (
          <>
            <h3>Create an account to get started.</h3>
            <SignUp className={styles.signUpForm} />
          </>
        ) : (
          <>
            <h3>Sign in</h3>
            <SignIn className={styles.signInForm} />
          </>
        )}
        <div className={styles.orSeparator}>
          <div />
          or
          <div />
        </div>
        <Button onClick={googleProvider} className={styles.googleButton}>
          <Image
            src='/google-icon.svg'
            height={20}
            width={20}
            alt='google-icon'
          />
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}
export default AuthPage
