import { FC } from 'react'
import styles from './Footer.module.css'
import Link from 'next/link'
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
  FaTiktok,
  FaTwitterSquare,
} from 'react-icons/fa'
import Button from '@/components/simple/Button'

export const Footer: FC = () => {
  const socialMediaLinks = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/DiscoverBerat',
      Icon: FaTwitterSquare,
      size: 30,
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/people/Discover-Berat/61556334115156/',
      Icon: FaFacebookSquare,
      size: 30,
    },
    {
      name: 'Linkedin',
      href: 'https://linkedin.com/discoverberat',
      Icon: FaLinkedin,
      size: 30,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/real.discoverberat',
      Icon: FaInstagramSquare,
      size: 30,
    },
    {
      name: 'TikTok',
      href: 'https://tiktok.com/discoverberat',
      Icon: FaTiktok,
      size: 24,
    },
  ]

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerTop}>
        <Button href={'/cookie-policy'} variant='link'>
          Cookies policy
        </Button>
        <Button href={'/privacy-policy'} variant='link'>
          Privacy policy
        </Button>
        <div className={styles.socialMediaContainer}>
          <p>Follow us</p>
          {socialMediaLinks.map(({ name, href, Icon, size }) => (
            <Link
              key={name}
              rel={'noreferrer noopener'}
              target={'_blank'}
              href={href}
              aria-label={name}
            >
              <Icon size={size} />
            </Link>
          ))}
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