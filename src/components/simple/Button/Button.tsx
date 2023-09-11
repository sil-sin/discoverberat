import { FC } from 'react'
import styles from './Button.module.css'
import classnames from 'classnames'

type Props = {
  onClick?: () => void
  text: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link'
  href?: string
}
export const Button: FC<Props> = ({ onClick, text, variant, href }) => {
  return variant === 'link' ? (
    <a href={href} onClick={onClick} className={styles.link}>
      {text}
    </a>
  ) : (
    <button
      onClick={onClick}
      className={classnames(styles.button, styles[`${variant}`])}
    >
      {text}
    </button>
  )
}
