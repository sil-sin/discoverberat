import classnames from 'classnames'
import { FC, useEffect } from 'react'
import styles from '../Auth.module.css'
import { SubmitHandler, useForm } from 'react-hook-form'
import Button from '@/components/simple/Button'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

type SignUpProps = {
  className?: string
}

type Inputs = {
  email: string
  password: string
}
export const SignIn: FC<SignUpProps> = ({ className }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<Inputs>()

  const auth = getAuth()
  const firebaseErrorMap: any = {
    'auth/invalid-login-credentials': 'password', // Map the Firebase error to the corresponding field
  }
  const inputRefs: any = {
    email: register('email', { required: 'Email is required' }),
    password: register('password', {
      required: 'Password is required',
    }),
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

        // Focus on the current input field
        if (inputRefs[fieldName].current) {
          inputRefs[fieldName].current.focus()
        }
        return
      }
    }
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((result) => {
        console.log(result)
      })
      .catch((err) => {
        const errorCode = err.code

        // Check if there is a mapped field for the Firebase error code
        const fieldName = firebaseErrorMap[errorCode]

        if (fieldName) {
          setError(fieldName as keyof Inputs, {
            type: 'manual',
            message: 'Invalid login credentials',
          })
        } else {
          // If no mapping is found, set a general error
          setError('email', {
            type: 'manual',
            message: 'Invalid login credentials',
          })
        }
      })
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
              {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
            </label>
            <input
              className={errors[fieldName as keyof Inputs] && styles.errorInput}
              type={fieldName === 'password' ? 'password' : 'text'}
              id={fieldName}
              placeholder={
                fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
              }
              {...inputRefs[fieldName as keyof Inputs]}
            />
            {errors[fieldName as keyof Inputs] && (
              <p className={styles.errorText}>
                {(errors[fieldName as keyof Inputs] as any)?.message}
              </p>
            )}
          </div>
        ))}

        <Button
          type='submit'
          text={'Sign in'}
          className={styles.formButton}
          variant='primary'
        />
      </form>
    </div>
  )
}
