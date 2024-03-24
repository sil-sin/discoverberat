import { FC } from 'react'
import styles from './Footer.module.css'
import Link from 'next/link'
import Button from '../../simple/Button/index'
import {
  FaFacebookSquare,
  FaInstagram,
  FaInstagramSquare,
  FaLinkedin,
  FaTiktok,
  FaTwitterSquare,
} from 'react-icons/fa'
export const Footer: FC = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerTop}>
        <Button variant='link' href={'/cookie-policy'}>
          Cookies policy
        </Button>
        <Button variant='link' href={'/privacy-policy'}>
          Privacy policy
        </Button>
        <div className={styles.socialMediaContainer}>
          <p>Follow us</p>
          <Link
            target={'_blank'}
            href={'https://twitter.com/DiscoverBerat'}
            aria-label='Twitter'
          >
            <FaTwitterSquare size={30} />
          </Link>
          <Link
            rel={'noreferrer'}
            target={'_blank'}
            href={
              'https://www.facebook.com/people/Discover-Berat/61556334115156/'
            }
            aria-label='Facebook'
          >
            <FaFacebookSquare size={30} />
          </Link>
          <Link
            target={'_blank'}
            href={'https://linkedin.com/discoverberat'}
            aria-label='Linkedin'
          >
            <FaLinkedin size={30} />
          </Link>
          <Link
            target={'_blank'}
            href={'https://www.instagram.com/real.discoverberat'}
            aria-label='Instagram'
          >
            <FaInstagramSquare size={30} />
          </Link>
          <Link
            rel={'noreferrer'}
            target={'_blank'}
            href={'https://tiktok.com/discoverberat'}
            aria-label='TikTok'
          >
            <FaTiktok size={24} />
          </Link>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>
          &copy; {new Date().getFullYear()} Discover Berat. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
