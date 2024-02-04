import { FC } from 'react'
import styles from './Toast.module.css'
import classNames from 'classnames'
import Button from '../Button'
import { MdClose } from 'react-icons/md'
import { GiCancel } from 'react-icons/gi'

type Props = {
  message: string
  onClose?: () => void
  isSuccess?: boolean
  isError?: boolean
  isInfo?: boolean
  isTextOnly?: boolean
}
export const Toast: FC<Props> = ({
  message,
  onClose,
  isSuccess = false,
  isError = false,
  isInfo = false,
  isTextOnly = false,
}) => {
  return (
    <div
      className={classNames(
        styles.toastContainer,
        isError && styles.error,
        isSuccess && styles.success,
        isInfo && styles.warning,
        isTextOnly && styles.textOnly
      )}
    >
      {message}
      {!isTextOnly && (
        <Button
          className={classNames(
            styles.closeButton,
            isError && styles.error,
            isSuccess && styles.success,
            isInfo && styles.warning
          )}
          variant='tertiary'
          onClick={onClose}
        >
          <GiCancel size={20} />
        </Button>
      )}
    </div>
  )
}
