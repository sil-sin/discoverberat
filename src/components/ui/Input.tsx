'use client'

import classnames from 'classnames'
import { ComponentProps, FC, ReactNode, useId, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import styles from './Input.module.css'

type FieldProps = {
  label: string
  hint?: ReactNode
  error?: string
  // Marks the field and sets aria-required; validation stays with the form, so no native `required` bubble.
  isRequired?: boolean
  className?: string
}

type FieldShellProps = FieldProps & {
  id: string
  children: (aria: {
    'aria-invalid': boolean
    'aria-required'?: boolean
    'aria-describedby'?: string
  }) => ReactNode
}

const Field: FC<FieldShellProps> = ({ id, label, hint, error, isRequired, className, children }) => {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={classnames(styles.field, className)}>
      <label htmlFor={id} className={classnames(styles.label, isRequired && styles.required)}>
        {label}
      </label>
      {children({
        'aria-invalid': Boolean(error),
        'aria-required': isRequired || undefined,
        'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
      })}
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}

type InputProps = FieldProps & Omit<ComponentProps<'input'>, 'className'>

export const Input: FC<InputProps> = ({
  label,
  hint,
  error,
  isRequired,
  className,
  id,
  type = 'text',
  ...props
}) => {
  const fallbackId = useId()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPassword = type === 'password'
  const inputId = id ?? fallbackId

  return (
    <Field {...{ label, hint, error, isRequired, className }} id={inputId}>
      {(aria) => (
        <div className={styles.control}>
          <input
            {...props}
            {...aria}
            id={inputId}
            type={isPassword && isPasswordVisible ? 'text' : type}
            className={classnames(styles.input, isPassword && styles.withToggle)}
          />
          {isPassword && (
            <button
              type='button'
              className={styles.toggle}
              disabled={props.disabled}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              {isPasswordVisible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          )}
        </div>
      )}
    </Field>
  )
}

type TextAreaProps = FieldProps & Omit<ComponentProps<'textarea'>, 'className'>

export const TextArea: FC<TextAreaProps> = ({
  label,
  hint,
  error,
  isRequired,
  className,
  id,
  rows = 5,
  ...props
}) => {
  const fallbackId = useId()
  const textAreaId = id ?? fallbackId

  return (
    <Field {...{ label, hint, error, isRequired, className }} id={textAreaId}>
      {(aria) => (
        <textarea
          {...props}
          {...aria}
          id={textAreaId}
          rows={rows}
          className={classnames(styles.input, styles.textArea)}
        />
      )}
    </Field>
  )
}
