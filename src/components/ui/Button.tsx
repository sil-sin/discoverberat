'use client'

import { FC, ReactNode } from 'react'
import styles from './Button.module.css'
import classnames from 'classnames'
import Link from 'next/link'

type Props = {
  onClick?: () => void
  text?: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link'
  href?: string
  children?: ReactNode
  className?: string
  isDisabled?: boolean
  isLoading?: boolean
  isPressed?: boolean
  type?: 'submit' | 'reset' | 'button'
  buttonName?: string
  popoverTarget?: string
}
export const Button: FC<Props> = ({
  onClick,
  text,
  variant,
  href,
  children,
  className,
  isDisabled,
  isLoading,
  isPressed,
  type = 'button',
  buttonName,
  popoverTarget,
}) => {
  return href ? (
    <Link
      href={href}
      onClick={onClick}
      className={classnames(
        className,
        variant === 'link' ? styles.link : [styles.button, styles[`${variant}`]]
      )}
    >
      {text || children}
    </Link>
  ) : (
    <>
      <button
        type={type}
        name={buttonName}
        title={buttonName}
        aria-label={buttonName}
        onClick={onClick}
        popoverTarget={popoverTarget}
        className={classnames(
          className,
          styles.button,
          styles[`${variant}`],
          isDisabled && styles.disabled,
          isLoading && styles.loading
        )}
        disabled={isDisabled || isLoading}
        aria-busy={isLoading}
        aria-pressed={isPressed}
      >
        {text || children}
      </button>
      {isLoading && (
        <span role='status' className={styles.srOnly}>
          Processing…
        </span>
      )}
    </>
  )
}
