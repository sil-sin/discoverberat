import { FC } from 'react'
import Image from 'next/image'
import { HEADER_LINKS } from './utils'
import styles from './Navigation.module.css'

type Props = {}
export const Navigation: FC<{}> = () => {
  return (
    <nav className={styles.navbarContainer}>
      <a rel='noopener' className={styles.logo} href='/'>
        <Image src='/vercel.svg' width={100} height={100} alt='Explore Berat' />
      </a>

      <ul className={styles.navbarLinksContainer}>
        {HEADER_LINKS.map((link: any) => (
          <li key={link.title}>
            <a href={link.href}>{link.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
