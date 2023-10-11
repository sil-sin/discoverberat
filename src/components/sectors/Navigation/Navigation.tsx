'use client'
import { FC, useState } from 'react'
import Image from 'next/image'
import { HEADER_LINKS } from './utils'
import styles from './Navigation.module.css'
import Button from '@/components/simple/Button'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import classNames from 'classnames'

type Props = {}
export const Navigation: FC<{}> = () => {
  const [isMenuShow, setIsMenuShow] = useState(false)

  return (
    <nav className={styles.navbarContainer}>
      <a rel='noopener' className={styles.logo} href='/'>
        <Image
          src='/main_logo.png'
          width={200}
          height={100}
          className={styles.logoImage}
          alt='Discover Berat'
        />
      </a>
      <Button
        className={styles.menuButton}
        variant='secondary'
        onClick={() => {
          setIsMenuShow(!isMenuShow)
        }}
      >
        {isMenuShow ? <AiOutlineClose /> : <AiOutlineMenu />}
      </Button>

      <ul
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
          onClick={() => {
            console.log('clicked')
          }}
          text='Login / Register'
        />
      </ul>
    </nav>
  )
}
