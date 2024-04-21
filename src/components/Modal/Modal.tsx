import { FC, useEffect, useState } from 'react'
import styles from './Modal.module.css'
import Link from 'next/link'
import Button from '../simple/Button'
import classNames from 'classnames'
import { AiOutlineClose } from 'react-icons/ai'
import { marked } from 'marked'

type modalCta = {
  ctaText?: string
  ctaUrl?: string
}
type Props = {
  withCTA?: boolean
  modalCta?: modalCta[]
  modalTitle?: string
  modalDescription?: string
  className?: string
  id: string
  onClose: () => void
}

export const Modal: FC<Props> = ({
  withCTA,
  modalTitle,
  modalDescription,
  className,
  id,
  modalCta,
  onClose,
}) => {
  return (
    <div id={id} className={classNames(className, styles.modalContainer)}>
      <Button
        variant='tertiary'
        className={styles.closeButton}
        onClick={onClose}
      >
        <AiOutlineClose size={18} />
      </Button>
      <h1>{modalTitle ?? 'Error occurred'}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: marked(modalDescription ?? '') }}
      />

      <div className={styles.ctaContainer}>
        {withCTA &&
          modalCta?.map((cta, index) => (
            <Link
              className={styles.cta}
              key={cta.ctaText ?? 'cta' + index}
              href={cta.ctaUrl ?? '/'}
            >
              {cta.ctaText ?? 'Home'}
            </Link>
          ))}
      </div>
    </div>
  )
}
