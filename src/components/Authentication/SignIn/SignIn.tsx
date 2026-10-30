import { REQUIRED } from '@/helpers/forms'
import classnames from 'classnames'
import { FC } from 'react'
import styles from '../Auth.module.css'
import { useForm } from 'react-hook-form'
import Button from '@/components/simple/Button'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import app from '@/utils/firebase/firebaseConfig'
import { authErrorMessage } from '@/utils/auth/errors'
import { useAuthContext } from '@/utils/auth/auth-provider'
import { PasswordInput } from '../PasswordInput'

type SignInProps = {
  className?: string
}

type Inputs = {
  email: string
  password: string
}

export const SignIn: FC<SignInProps> = ({ className }) => {
  const { closeAuth } = useAuthContext()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const onSubmit = ({ email, password }: Inputs) =>
    signInWithEmailAndPassword(getAuth(app), email, password).catch((error) =>
      setError('root', { message: authErrorMessage(error) })
    )

  return (
    <form
      data-testid='sign-in-form'
      className={classnames(styles.form, className)}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.field}>
        <label htmlFor='sign-in-email'>Email</label>
        <input
          id='sign-in-email'
          type='email'
          autoComplete='email'
          aria-invalid={Boolean(errors.email)}
          className={classnames(errors.email && styles.errorInput)}
          {...register('email', { required: REQUIRED })}
        />
        {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
      </div>
      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label htmlFor='sign-in-password'>Password</label>
          <Button
            className={styles.forgotPasswordLink}
            variant='link'
            href='/authenticate/forgot-password'
            text='Forgot password?'
            onClick={closeAuth}
          />
        </div>
        <PasswordInput
          id='sign-in-password'
          autoComplete='current-password'
          hasError={Boolean(errors.password)}
          {...register('password', { required: REQUIRED })}
        />
        {errors.password && (
          <p className={styles.errorText}>{errors.password.message}</p>
        )}
      </div>
      {errors.root && (
        <p data-testid='sign-in-error' role='alert' className={styles.formError}>
          {errors.root.message}
        </p>
      )}
      <Button
        type='submit'
        text={isSubmitting ? '' : 'Sign in'}
        isLoading={isSubmitting}
        className={styles.formButton}
        variant='primary'
      />
    </form>
  )
}
