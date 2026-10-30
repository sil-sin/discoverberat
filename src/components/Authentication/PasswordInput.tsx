import classnames from 'classnames'
import { ComponentProps, FC, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import styles from './Auth.module.css'

type Props = ComponentProps<'input'> & { hasError?: boolean }

export const PasswordInput: FC<Props> = ({ hasError, ...props }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className={styles.passwordWrapper}>
      <input
        {...props}
        type={isVisible ? 'text' : 'password'}
        aria-invalid={hasError}
        className={classnames(hasError && styles.errorInput)}
      />
      <button
        type='button'
        className={styles.passwordToggle}
        onClick={() => setIsVisible(!isVisible)}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
      >
        {isVisible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
      </button>
    </div>
  )
}
