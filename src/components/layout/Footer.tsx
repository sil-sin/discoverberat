import { FC } from 'react'
import styles from './Footer.module.css'
import Link from 'next/link'
import { FaInstagram } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'

export const Footer: FC = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerTop}>
        <Button href={'/cookie-policy'} variant='link'>
          Cookies policy
        </Button>
        <Button href={'/privacy-policy'} variant='link'>
          Privacy policy
        </Button>
        <Button href={'/refund-policy'} variant='link'>
          Refund policy
        </Button>
        <Button href={'/terms'} variant='link'>
          Terms
        </Button>
        <div className={styles.socialMediaContainer}>
          <p>Follow us</p>
          <Link
            rel={'noreferrer noopener'}
            target={'_blank'}
            href={'https://www.instagram.com/real.discoverberat'}
            aria-label={'Instagram'}
          >
            <FaInstagram size={28} />
          </Link>
        </div>
      </div>
      <p>
        &copy; {new Date().getFullYear()} Discover Berat. All rights reserved.
      </p>
    </footer>
  )
}