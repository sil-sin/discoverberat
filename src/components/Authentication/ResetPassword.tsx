import React from 'react'
import styles from './Auth.module.css'
import Button from '../simple/Button'
import { sendPasswordResetEmail } from 'firebase/auth'

type Props = {
  onChange?: (value: any) => void
  onSubmit?: () => void
}

export default function ResetPassword({ onSubmit, onChange }: Props) {
  return (
    <div className={styles.formContainer}>
      <h1>Reset Password</h1>
      <label htmlFor='email'>Type your email address: </label>
      <input
        onChange={onChange}
        placeholder='Email'
        type='email'
        name='email'
        id='email'
      />
      <Button onClick={onSubmit} variant='primary'>
        Reset Password
      </Button>
    </div>
  )
}
