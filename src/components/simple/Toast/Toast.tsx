'use client'

import { FC, ReactNode, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Toast.module.css'
import classNames from 'classnames'
import Button from '../Button'
import { GiCancel } from 'react-icons/gi'
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'
import type { IconType } from 'react-icons'

type Tone = 'success' | 'error' | 'info'
type ToastItem = {
  id: number
  tone: Tone
  message: string
  link?: { label: string; href: string }
  confirm?: { label: string; onAnswer: (confirmed: boolean) => void }
  isBanner?: boolean
}

let toasts: ToastItem[] = []
let nextId = 0
const listeners = new Set<() => void>()
const setToasts = (next: ToastItem[]) => {
  toasts = next
  listeners.forEach((listener) => listener())
}
const dismiss = (id: number) => setToasts(toasts.filter((item) => item.id !== id))
const show =
  (tone: Tone) => (message: string, link?: ToastItem['link']) => {
    const id = ++nextId
    setToasts([...toasts, { id, tone, message, link }])
    setTimeout(() => dismiss(id), 5000)
  }
const answerPendingConfirm = () =>
  toasts.find((item) => item.confirm)?.confirm?.onAnswer(false)
const dismissBanner = () => setToasts(toasts.filter((item) => !item.isBanner))

export const toast = {
  success: show('success'),
  error: show('error'),
  info: show('info'),
  // Page-level messages: one at a time, shown under the navigation until dismissed or the route changes.
  banner: (tone: Tone, message: string, link?: ToastItem['link']) =>
    setToasts([
      ...toasts.filter((item) => !item.isBanner),
      { id: ++nextId, tone, message, link, isBanner: true },
    ]),
  confirm: (message: string, label: string) =>
    new Promise<boolean>((resolve) => {
      answerPendingConfirm()
      const opener = document.activeElement as HTMLElement | null
      const id = ++nextId
      const onAnswer = (confirmed: boolean) => {
        dismiss(id)
        if (opener?.isConnected) opener.focus()
        resolve(confirmed)
      }
      setToasts([...toasts, { id, tone: 'info', message, confirm: { label, onAnswer } }])
    }),
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const noToasts: ToastItem[] = []
const icons = { success: FiCheckCircle, error: FiAlertCircle, info: FiInfo }
const toneClasses = {
  success: undefined,
  error: styles.toastError,
  info: styles.toastInfo,
}

export const Toaster: FC = () => {
  const items = useSyncExternalStore(subscribe, () => toasts, () => noToasts)
  const pathname = usePathname()
  useEffect(() => {
    answerPendingConfirm()
    dismissBanner()
  }, [pathname])

  return (
    <section aria-live='polite' aria-label='Notifications' className={styles.toaster}>
      {items.filter((item) => !item.isBanner).map(({ id, tone, message, link, confirm }) => {
        const Icon = icons[tone]
        return (
          <div
            key={id}
            role={tone === 'error' ? 'alert' : undefined}
            className={classNames(styles.toast, toneClasses[tone])}
          >
            <Icon aria-hidden className={styles.icon} />
            <p className={styles.message}>
              {message}
              {link && (
                <>
                  {' '}
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </>
              )}
            </p>
            {confirm ? (
              <div className={styles.toastActions}>
                <button
                  type='button'
                  autoFocus
                  onClick={() => confirm.onAnswer(false)}
                >
                  Go back
                </button>
                <button
                  type='button'
                  className={styles.confirm}
                  onClick={() => confirm.onAnswer(true)}
                >
                  {confirm.label}
                </button>
              </div>
            ) : (
              <button
                type='button'
                aria-label='Dismiss'
                className={styles.dismiss}
                onClick={() => dismiss(id)}
              >
                <FiX aria-hidden />
              </button>
            )}
          </div>
        )
      })}
    </section>
  )
}

type BannerViewProps = {
  tone: Tone
  Icon?: IconType
  title?: string
  children: ReactNode
  onDismiss?: () => void
}

export const BannerView: FC<BannerViewProps> = ({
  tone,
  Icon = icons[tone],
  title,
  children,
  onDismiss,
}) => (
  <div
    ref={(element) => {
      element?.focus()
    }}
    tabIndex={-1}
    role={tone === 'error' ? 'alert' : 'status'}
    className={classNames(styles.banner, tone === 'error' && styles.bannerError)}
  >
    <Icon aria-hidden className={styles.bannerIcon} />
    <p className={styles.bannerText}>
      {title && <strong>{title}</strong>}
      <span>{children}</span>
    </p>
    {onDismiss && (
      <button
        type='button'
        aria-label='Dismiss'
        className={styles.dismiss}
        onClick={onDismiss}
      >
        <FiX aria-hidden />
      </button>
    )}
  </div>
)

export const Banner: FC = () => {
  const items = useSyncExternalStore(subscribe, () => toasts, () => noToasts)
  const banner = items.find((item) => item.isBanner)
  if (!banner) return null
  const { id, tone, message, link } = banner
  return (
    <BannerView key={id} tone={tone} onDismiss={() => dismiss(id)}>
      {message}
      {link && (
        <>
          {' '}
          <Link href={link.href} className={styles.link}>
            {link.label}
          </Link>
        </>
      )}
    </BannerView>
  )
}

type Props = {
  message: string
  onClose?: () => void
  isSuccess?: boolean
  isError?: boolean
  isInfo?: boolean
  isTextOnly?: boolean
  withCLoseButton?: boolean
}
export const Toast: FC<Props> = ({
  message,
  onClose,
  isSuccess = false,
  isError = false,
  isInfo = false,
  isTextOnly = false,
  withCLoseButton = true,
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
          buttonName='Close'
          onClick={onClose}
        >
          {withCLoseButton && <GiCancel size={20} />}
        </Button>
      )}
    </div>
  )
}
