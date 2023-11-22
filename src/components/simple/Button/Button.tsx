import { FC, ReactNode } from 'react'
import styles from './Button.module.css'
import classnames from 'classnames'

type Props = {
  onClick?: () => void
  text?: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link'
  href?: string
  children?: ReactNode
  className?: string
  isDisabled?: boolean
}
export const Button: FC<Props> = ({
  onClick,
  text,
  variant,
  href,
  children,
  className,
  isDisabled,
}) => {
  return variant === 'link' ? (
    <a
      href={href}
      onClick={onClick}
      className={classnames(className, styles.link)}
    >
      {text || children}
    </a>
  ) : (
    <button
      onClick={onClick}
      className={classnames(
        className,
        styles.button,
        styles[`${variant}`],
        isDisabled && styles.disabled
      )}
      disabled={isDisabled}
    >
      {text || children}
    </button>
  )
}
