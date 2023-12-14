import { signUpWithEmail } from '@/utils/auth/emailSignUp'
import classnames from 'classnames'
import { FC, useRef } from 'react'
import styles from '../Auth.module.css'

import { SubmitHandler, useForm } from 'react-hook-form'
import Button from '@/components/simple/Button'

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
  const {
    register,
    handleSubmit,
    watch,
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
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
          message:
            'Password must contain at least one lowercase letter, one uppercase letter, and one number',
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
          message: `${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } is required`,
        })

        if (inputRefs[fieldName as keyof Inputs].current) {
          inputRefs[fieldName as keyof Inputs].current.focus()
        }

        return
      }
    }
    
    signUpWithEmail(
      data.target.email.value,
      data.target.password.value,
      data.target.firstName.value + ' ' + data.target.lastName.value
    )
  }
  return (
    <div className={classnames(styles.formContainer, className)}>
      <form
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
            <input
              className={errors[fieldName as keyof Inputs] && styles.errorInput}
              type={fieldName === 'password' ? 'password' : 'text'}
              id={fieldName}
              placeholder={inputRefs[fieldName as keyof Inputs].placeholder}
              {...inputRefs[fieldName as keyof Inputs].ref}
            />
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
