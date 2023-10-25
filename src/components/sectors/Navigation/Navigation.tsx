import { FC, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { HEADER_LINKS } from './utils'
import styles from './Navigation.module.css'
import Button from '@/components/simple/Button'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import classNames from 'classnames'
import Link from 'next/link'

type Props = {}

export const Navigation: FC<{}> = () => {
  const [isMenuShow, setIsMenuShow] = useState(false)
  // const menuRef = useRef<any>()

  // useEffect(() => {
  //   // Function to handle clicks outside the <ul>
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
  //       setIsMenuShow(false)
  //     }
  //   }

  //   // Add the event listener when the component mounts
  //   document.addEventListener('mousedown', handleClickOutside)

  //   // Remove the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [])

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.imageIcon}>
        <Link rel='noopener' className={styles.logo} href='/'>
          <Image
            src='/main_logo.png'
            width={200}
            height={100}
            className={styles.logoImage}
            alt='Discover Berat'
          />
        </Link>
        <Button
          className={styles.menuButton}
          variant='secondary'
          onClick={() => {
            setIsMenuShow(!isMenuShow)
          }}
        >
          {isMenuShow ? (
            <AiOutlineClose size={20} className={styles.menuIcon} />
          ) : (
            <AiOutlineMenu size={20} className={styles.menuIcon} />
          )}
        </Button>
      </div>
      <ul
        // ref={menuRef}
        className={classNames(
          isMenuShow ? styles.navbarLinksShow : styles.navbarLinksContainer
        )}
      >
        {HEADER_LINKS.map((link: any) => (
          <li key={link.title}>
            <Button variant='link' href={link.href} text={link.title} />
          </li>
        ))}
        <Button
          variant='secondary'
          onClick={() => {}}
          text='Login / Register'
        />
      </ul>
    </nav>
  )
}
