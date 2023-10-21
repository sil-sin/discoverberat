import { FC } from 'react'
import styles from './Footer.module.css'
export const Footer: FC = () => {
  return (
    <footer className={styles.footerContainer}>
  <div className={styles.footerColumns}>
        <div className={styles.footerColumn}>
          <h3>Our Services</h3>
          <ul>
            <li>
              <a href='/service1'>Service 1</a>
            </li>
            <li>
              <a href='/service2'>Service 2</a>
            </li>
            <li>
              <a href='/service3'>Service 3</a>
            </li>
            {/* Add more services as needed */}
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3>About Us</h3>
          <ul>
            <li>
              <a href='/about'>About</a>
            </li>
            <li>
              <a href='/contact'>Contact</a>
            </li>
            {/* Add more about/contact links as needed */}
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3>Social Media</h3>
          <ul>
            <li>
              <a href='https://twitter.com'>Twitter</a>
            </li>
            <li>
              <a href='https://facebook.com'>Facebook</a>
            </li>
            <li>
              <a href='https://instagram.com'>Instagram</a>
            </li>
            {/* Add more social media links as needed */}
          </ul>
        </div>
  </div>

      <div className={styles.footerBottom}>
        <p>
          &copy; {new Date().getFullYear()} Discover Berat. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}
