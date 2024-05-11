import React, { FC } from 'react'
import styles from '../Auth.module.css'
import Button from '@/components/simple/Button'

type Props = {
  onChange?: (value: any) => void
  onSubmit?: () => void
}

export const ResetPassword: FC<Props> = ({ onSubmit, onChange }) => {
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
      <Button data-testid='reset-password-button' onClick={onSubmit} variant='primary'>
        Reset Password
      </Button>
    </div>
  )
}
