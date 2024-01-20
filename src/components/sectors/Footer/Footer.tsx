import { FC } from 'react'
import styles from './Footer.module.css'
import Link from 'next/link'
export const Footer: FC = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerColumns}>
        <div className={styles.footerColumn}>
          <h3>Our Services</h3>
          <ul>
            <li>
              <Link href='/service1'>Service 1</Link>
            </li>
            <li>
              <Link href='/service2'>Service 2</Link>
            </li>
            <li>
              <Link href='/service3'>Service 3</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3>About Us</h3>
          <ul>
            <li>
              <Link href='/about'>About</Link>
            </li>
            <li>
              <Link href='/contact'>Contact</Link>
            </li>
            {/* Add more about/contact links as needed */}
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3>Social Media</h3>
          <ul>
            <li>
              <Link href='https://facebook.com'>Facebook</Link>
            </li>
            <li>
              <Link href='https://instagram.com'>Instagram</Link>
            </li>
            {/* Add more social media links as needed */}
          </ul>
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
