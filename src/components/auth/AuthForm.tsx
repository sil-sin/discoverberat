'use client'

import classnames from 'classnames'
import Image from 'next/image'
import { FC, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import { AuthReason, useAuthContext } from '@/lib/auth/auth-provider'
import { googleProvider } from '@/lib/auth/google-provider'
import { SignIn } from './SignIn'
import { SignUp } from './SignUp'
import styles from './Auth.module.css'

const NOTICES: Record<AuthReason, { title: string; text: string }> = {
  signIn: {
    title: 'Welcome back',
    text: 'Sign in to book tours and keep your bookings in one place.',
  },
  save: {
    title: 'Sign in to save this tour',
    text: 'Saved tours are kept in your account. After you sign in, tap Save again.',
  },
  book: {
    title: 'Sign in to book this tour',
    text: 'Bookings are kept in your account. After you sign in, your booking details stay on this page.',
  },
}

export const AuthForm: FC<{ reason?: string | null }> = ({ reason }) => {
  const { user, loading } = useAuthContext()
  const [isSignUp, setIsSignUp] = useState(false)
  const [googleError, setGoogleError] = useState<string | null>(null)
  const notice = Object.hasOwn(NOTICES, reason ?? '')
    ? NOTICES[reason as AuthReason]
    : NOTICES.signIn
  // Signed in but not yet redirected or closed: keep the form busy so the user sees progress.
  const isBusy = loading || Boolean(user)

  return (
    <div className={styles.card} inert={isBusy} aria-busy={isBusy}>
      <header className={styles.header}>
        <h1 id='auth-title'>{isSignUp ? 'Create your account' : notice.title}</h1>
        <p>{notice.text}</p>
      </header>
      <div className={styles.tabs}>
        {[false, true].map((isSignUpTab) => (
          <button
            key={String(isSignUpTab)}
            type='button'
            aria-pressed={isSignUp === isSignUpTab}
            className={classnames(styles.tab, isSignUp === isSignUpTab && styles.activeTab)}
            onClick={() => setIsSignUp(isSignUpTab)}
          >
            {isSignUpTab ? 'Create account' : 'Sign in'}
          </button>
        ))}
      </div>
      {isSignUp ? <SignUp /> : <SignIn />}
      <div className={styles.separator}>or</div>
      <Button
        variant='secondary'
        isLoading={isBusy}
        className={styles.googleButton}
        onClick={async () => setGoogleError(await googleProvider())}
      >
        {!isBusy && (
          <>
            <Image src='/google-icon.svg' height={20} width={20} alt='' />
            Continue with Google
          </>
        )}
      </Button>
      {googleError && (
        <p role='alert' className={styles.formError}>
          {googleError}
        </p>
      )}
    </div>
  )
}

export const AuthDialog: FC = () => {
  const { authReason, closeAuth } = useAuthContext()
  if (!authReason) return null

  return (
    <dialog
      ref={(dialog) => {
        if (dialog && !dialog.open) dialog.showModal()
      }}
      aria-labelledby='auth-title'
      className={styles.dialog}
      onClose={closeAuth}
      onClick={(event) => event.target === event.currentTarget && closeAuth()}
    >
      <button type='button' aria-label='Close' className={styles.close} onClick={closeAuth}>
        <FiX aria-hidden size={20} />
      </button>
      <AuthForm reason={authReason} />
    </dialog>
  )
}
