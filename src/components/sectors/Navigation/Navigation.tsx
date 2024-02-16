import { FC, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { HEADER_LINKS } from './utils'
import styles from './Navigation.module.css'
import Button from '@/components/simple/Button'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import classNames from 'classnames'
import Link from 'next/link'
import { useAuthContext } from '@/utils/auth/auth-provider'
import { useRouter } from 'next/router'
import { UserMenuDropDown } from './components/UserMenuDropDown'
import useResponsiveState from './utils/useResetState'

export const Navigation: FC<{ className?: string }> = ({ className }) => {
  const [isMenuShow, setIsMenuShow] = useState(false)
  const [isShowUserMenu, setIsShowUserMenu] = useState(false)
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const [isLargeScreen] = useResponsiveState()

  useEffect(() => {
    setIsShowUserMenu(false)
  }, [isLargeScreen])

  return (
    <nav className={classNames(className, styles.navbarContainer)}>
      <div className={styles.imageIcon}>
        <Link className={styles.logo} href={'/'}>
          <Image
            priority
            src='/main_logo.svg'
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
        className={classNames(
          isMenuShow ? styles.navbarLinksShow : styles.navbarLinksContainer
        )}
      >
        {HEADER_LINKS.map((link: any) => (
          <li key={link.title}>
            <Button
              onClick={() => setIsMenuShow(false)}
              variant='link'
              href={link.href}
              text={link.title}
            />
          </li>
        ))}
        <li>
          <Button
            variant='secondary'
            onClick={() => {
              user?.uid
                ? setIsShowUserMenu(!isShowUserMenu)
                : (router.push('/authenticate'), setIsMenuShow(false))
            }}
            text={
              loading
                ? '...'
                : user
                ? user?.displayName?.split(' ')[0] ?? ''
                : 'Sign in'
            }
          />
          {isShowUserMenu && <UserMenuDropDown />}
        </li>
      </ul>
    </nav>
  )
}
