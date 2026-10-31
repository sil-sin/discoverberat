import { REQUIRED } from '@/lib/forms'
import classnames from 'classnames'
import { FC } from 'react'
import styles from './Auth.module.css'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import app from '@/lib/firebase/client'
import { authErrorMessage } from '@/lib/auth/errors'
import { useAuthContext } from '@/lib/auth/auth-provider'
import { Input } from '@/components/ui/Input'

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
      <Input
        label='Email'
        id='sign-in-email'
        type='email'
        autoComplete='email'
        isRequired
        error={errors.email?.message}
        {...register('email', { required: REQUIRED })}
      />
      <div className={styles.passwordField}>
        <Input
          label='Password'
          id='sign-in-password'
          type='password'
          autoComplete='current-password'
          isRequired
          error={errors.password?.message}
          {...register('password', { required: REQUIRED })}
        />
        <Button
          className={styles.forgotPasswordLink}
          variant='link'
          href='/authenticate/forgot-password'
          text='Forgot password?'
          onClick={closeAuth}
        />
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
