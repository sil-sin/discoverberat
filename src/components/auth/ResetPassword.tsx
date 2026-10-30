import React, { FC } from 'react'
import styles from './Auth.module.css'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Props = {
  onChange?: (value: any) => void
  onSubmit?: () => void
  isSent?: boolean
  isLoading?: boolean
  error?: string | null
}

export const ResetPassword: FC<Props> = ({ onSubmit, onChange, isSent, isLoading, error }) => {
  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <h1>Reset Password</h1>
        <p>
          {isSent
            ? 'If an account exists for this email, we sent a link to reset your password. Check your inbox and spam folder.'
            : 'Enter your email. We send you a link to choose a new password.'}
        </p>
      </header>
      {!isSent && (
        <form
          className={styles.form}
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit?.()
          }}
        >
          <Input
            label='Email'
            onChange={onChange}
            placeholder='Email'
            type='email'
            name='email'
            id='email'
            autoComplete='email'
            isRequired
            error={error ?? undefined}
          />
          <Button
            data-testid='reset-password-button'
            type='submit'
            isLoading={isLoading}
            className={styles.formButton}
            variant='primary'
          >
            {!isLoading && 'Send reset link'}
          </Button>
        </form>
      )}
      <Button variant='link' href='/authenticate' className={styles.forgotPasswordLink}>
        Back to sign in
      </Button>
    </div>
  )
}
