import { signUpWithEmail } from '@/utils/auth/emailSignUp'
import classnames from 'classnames'
import { FC } from 'react'
import styles from '../Auth.module.css'
import { SubmitHandler, useForm } from 'react-hook-form'

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
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm<Inputs>()

  const inputRefs: any = {
    email: register('email', { required: 'Email is required' }),
    password: register('password', {
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
  }
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    console.log(data)
    console.log(isValid)

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
    // signInWithEmailAndPassword(
    //   data.target.email.value,
    //   data.target.password.value,
    // )
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
              required
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

        <input type='submit' value={'Sign in'} />
      </form>
    </div>
  )
}
