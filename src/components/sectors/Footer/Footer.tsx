import { FC } from 'react'
import styles from './Footer.module.css'
import Link from 'next/link'
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
      <div className={styles.socialMediaContainer}>
        <p>Follow us</p>
        <Link href={'https://twitter.com/DiscoverBerat'}>
          <FaTwitterSquare size={30} />
        </Link>
        <Link
          href={
            'https://www.facebook.com/people/Discover-Berat/61556334115156/'
          }
        >
          <FaFacebookSquare size={30} />
        </Link>
        <Link href={'https://facebook.com/discoverberat'}>
          <FaLinkedin size={30} />
        </Link>
        <Link href={'https://instagram.com/discoverberat'}>
          <FaInstagramSquare size={30} />
        </Link>
        <Link href={'https://tiktok.com/discoverberat'}>
          <FaTiktok size={24} />
        </Link>
      </div>
      <div className={styles.footerBottom}>
        <p>
          &copy; {new Date().getFullYear()} Discover Berat. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
