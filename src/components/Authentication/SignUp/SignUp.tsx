import { REQUIRED } from '@/helpers/forms'
import { signUpWithEmail } from '@/utils/auth/emailSignUp'
import { authErrorMessage } from '@/utils/auth/errors'
import classnames from 'classnames'
import { FC } from 'react'
import Link from 'next/link'
import styles from '../Auth.module.css'
import { useForm } from 'react-hook-form'
import Button from '@/components/simple/Button'
import { useAuthContext } from '@/utils/auth/auth-provider'
import { PasswordInput } from '../PasswordInput'

type SignUpProps = {
  className?: string
}

type Inputs = {
  firstName: string
  lastName: string
  email: string
  password: string
}

const NAME_FIELDS = [
  { name: 'firstName', label: 'First name', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last name', autoComplete: 'family-name' },
] as const

export const SignUp: FC<SignUpProps> = ({ className }) => {
  const { closeAuth } = useAuthContext()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()
  // Read per field: React Compiler caches the map below on `errors`, which react-hook-form mutates in place.
  const nameErrors = {
    firstName: errors.firstName?.message,
    lastName: errors.lastName?.message,
  }

  const onSubmit = ({ firstName, lastName, email, password }: Inputs) =>
    signUpWithEmail(email, password, `${firstName.trim()} ${lastName.trim()}`).catch(
      (error) => setError('root', { message: authErrorMessage(error) })
    )

  return (
    <form
      data-testid='sign-up-form'
      className={classnames(styles.form, className)}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.nameRow}>
        {NAME_FIELDS.map(({ name, label, autoComplete }) => (
          <div key={name} className={styles.field}>
            <label htmlFor={`sign-up-${name}`}>{label}</label>
            <input
              id={`sign-up-${name}`}
              autoComplete={autoComplete}
              aria-invalid={Boolean(nameErrors[name])}
              className={classnames(nameErrors[name] && styles.errorInput)}
              {...register(name, { required: REQUIRED })}
            />
            {nameErrors[name] && <p className={styles.errorText}>{nameErrors[name]}</p>}
          </div>
        ))}
      </div>
      <div className={styles.field}>
        <label htmlFor='sign-up-email'>Email</label>
        <input
          id='sign-up-email'
          type='email'
          autoComplete='email'
          aria-invalid={Boolean(errors.email)}
          className={classnames(errors.email && styles.errorInput)}
          {...register('email', { required: REQUIRED })}
        />
        {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
      </div>
      <div className={styles.field}>
        <label htmlFor='sign-up-password'>Password</label>
        <PasswordInput
          id='sign-up-password'
          autoComplete='new-password'
          aria-describedby='sign-up-password-hint'
          hasError={Boolean(errors.password)}
          {...register('password', {
            required: REQUIRED,
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
              message: 'Your password does not follow these rules.',
            },
          })}
        />
        <p id='sign-up-password-hint' className={styles.hint}>
          At least 8 characters, with an uppercase letter, a lowercase letter, a
          number and a symbol.
        </p>
        {errors.password && (
          <p className={styles.errorText}>{errors.password.message}</p>
        )}
      </div>
      {errors.root && (
        <p role='alert' className={styles.formError}>
          {errors.root.message}
        </p>
      )}
      <Button
        type='submit'
        text={isSubmitting ? '' : 'Create account'}
        isLoading={isSubmitting}
        className={styles.formButton}
        variant='primary'
      />
      <p className={styles.legal}>
        By creating an account you agree to our{' '}
        <Link href='/terms' onClick={closeAuth}>
          Terms
        </Link>{' '}
        and{' '}
        <Link href='/privacy-policy' onClick={closeAuth}>
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  )
}
