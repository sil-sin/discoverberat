import { signUpWithEmail } from '@/utils/auth/emailSignUp'
import classnames from 'classnames'
import { FC, useRef, useState } from 'react'
import styles from '../Auth.module.css'

import { SubmitHandler, useForm } from 'react-hook-form'
import Button from '@/components/simple/Button'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

type SignUpProps = {
  className?: string
}

type Inputs = {
  firstName: string
  lastName: string
  email: string
  password: string
}
export const SignUp: FC<SignUpProps> = ({ className }) => {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<Inputs>()

  const inputRefs: Record<keyof Inputs, any> = {
    firstName: {
      ref: register('firstName', { required: 'First Name is required' }),
      placeholder: 'First name',
      label: 'First Name',
    },
    lastName: {
      ref: register('lastName', { required: 'Last Name is required' }),
      placeholder: 'Last name',
      label: 'Last Name',
    },
    email: {
      ref: register('email', { required: 'Email is required' }),
      placeholder: 'Email',
      label: 'Email',
    },
    password: {
      ref: register('password', {
        required: 'Password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters long',
        },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
          message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol',
        },
      }),
      placeholder: 'Password',
      label: 'Password',
    },
  }
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    for (const fieldName in inputRefs) {
      if (!data[fieldName]) {
        setError(fieldName as keyof Inputs, {
          type: 'manual',
          message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
            } is required`,
        })

        if (inputRefs[fieldName as keyof Inputs].current) {
          inputRefs[fieldName as keyof Inputs].current.focus()
        }

        return
      }
    }

    signUpWithEmail(
      data.email,
      data.password,
      data.firstName + ' ' + data.lastName
    )
  }

  return (
    <div className={classnames(styles.formContainer, className)}>
      <form
        data-testid='sign-up-form'
        className={classnames(styles.formContainer, className)}
        action=''
        method='post'
        onSubmit={handleSubmit(onSubmit)}
      >
        {Object.keys(inputRefs).map((fieldName) => (
          <div key={fieldName} className={styles.inputWrapper}>
            <label htmlFor={fieldName}>
              {inputRefs[fieldName as keyof Inputs].label}
            </label>
            <div className={fieldName === 'password' ? styles.passwordWrapper : undefined}>
              <input
                className={errors[fieldName as keyof Inputs] && styles.errorInput}
                type={
                  fieldName === 'password'
                    ? (showPassword ? 'text' : 'password')
                    : fieldName === 'email'
                      ? 'email'
                      : 'text'
                }
                id={fieldName}
                placeholder={inputRefs[fieldName as keyof Inputs].placeholder}
                {...inputRefs[fieldName as keyof Inputs].ref}
              />
              {fieldName === 'password' && (
                <button
                  type='button'
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              )}
            </div>
            {errors[fieldName as keyof Inputs] && (
              <p className={styles.errorText}>
                {errors[fieldName as keyof Inputs]?.message}
              </p>
            )}
          </div>
        ))}

        <Button
          type='submit'
          text={'Sign up'}
          className={styles.formButton}
          variant='primary'
        />
      </form>
    </div>
  )
}
