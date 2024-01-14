
import { FC, useEffect, useState } from 'react'
import styles from './Modal.module.css'
import Link from 'next/link'
import Button from '../simple/Button'
import { useAuthContext } from '@/utils/auth/auth-provider'
import useSaveLater from '@/hooks/useSaveLater'
import classNames from 'classnames'
import {
    useRouter
} from 'next/router'
import { AiFillCloseSquare, AiOutlineClose } from 'react-icons/ai'


type Props = {
    withCTA?: boolean
    ctaText?: string
    ctaUrl?: string
    modalTitle?: string
    modalDescription?: string
    className?: string
    id: string
    onClose: () => void;
}

export const Modal: FC<Props> = ({
    withCTA,
    ctaText,
    ctaUrl,
    modalTitle,
    modalDescription,
    className,
    id,
    onClose
}) => {

    return (
        <div id={id} className={classNames(className, styles.modalContainer)}>
            <Button variant='tertiary' className={styles.closeButton} onClick={onClose}>
                <AiOutlineClose size={18} />
            </Button>
            <h1>{modalTitle ?? 'Error occurred'}</h1>
            <p>{modalDescription}</p>
            {withCTA && <Link href={ctaUrl ?? '/'}>{ctaText ?? 'Home'}</Link>}
        </div>
    )
}