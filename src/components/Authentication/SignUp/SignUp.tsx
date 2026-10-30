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
import { Input } from '@/components/simple/Input'

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
          <Input
            key={name}
            label={label}
            id={`sign-up-${name}`}
            autoComplete={autoComplete}
            isRequired
            error={nameErrors[name]}
            {...register(name, { required: REQUIRED })}
          />
        ))}
      </div>
      <Input
        label='Email'
        id='sign-up-email'
        type='email'
        autoComplete='email'
        isRequired
        error={errors.email?.message}
        {...register('email', { required: REQUIRED })}
      />
      <Input
        label='Password'
        id='sign-up-password'
        type='password'
        autoComplete='new-password'
        isRequired
        hint='At least 8 characters, with an uppercase letter, a lowercase letter, a number and a symbol.'
        error={errors.password?.message}
        {...register('password', {
          required: REQUIRED,
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
            message: 'Your password does not follow these rules.',
          },
        })}
      />
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
