'use client'
import { FC } from 'react'
import Image from 'next/image'
import { HEADER_LINKS } from './utils'
import styles from './Navigation.module.css'
import Button from '@/components/simple/Button'

type Props = {}
export const Navigation: FC<{}> = () => {
  return (
    <nav className={styles.navbarContainer}>
      <a rel='noopener' className={styles.logo} href='/'>
        <Image src='/vercel.svg' width={100} height={70} alt='Explore Berat' />
      </a>

      <ul className={styles.navbarLinksContainer}>
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
