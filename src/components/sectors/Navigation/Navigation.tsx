'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import { HEADER_LINKS } from './utils';
import styles from './Navigation.module.css';
import Button from '@/components/simple/Button';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import classNames from 'classnames';
import Link from 'next/link';
import { useAuthContext } from '@/utils/auth/auth-provider';
import { usePathname, useRouter } from 'next/navigation';
import { UserMenuDropDown } from './components/UserMenuDropDown';
import { signOutUser } from '@/utils/auth/signOut';

export const Navigation: FC<{ className?: string }> = ({ className }) => {
  const [isMenuShow, setIsMenuShow] = useState(false);
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMenuShow(false);
  }

  return (
    <nav className={classNames(className, styles.navbarContainer)}>
      {isMenuShow && (
        <div
          aria-hidden
          className={styles.backdrop}
          onClick={() => setIsMenuShow(false)}
        />
      )}
      <div className={styles.imageIcon}>
        <Link className={styles.logo} href={'/'}>
          <Image
            priority
            src="/main_logo.svg"
            width={200}
            height={100}
            className={styles.logoImage}
            alt="Discover Berat"
          />
        </Link>
        <Button
          buttonName="Menu button"
          aria-label="Menu"
          className={styles.menuButton}
          variant="secondary"
          onClick={() => {
            setIsMenuShow(!isMenuShow);
          }}
        >
          {isMenuShow ? (
            <AiOutlineClose
              size={20}
              className={styles.menuIcon}
              name="Menu close"
            />
          ) : (
            <AiOutlineMenu
              size={20}
              className={styles.menuIcon}
              name="Menu open"
            />
          )}
        </Button>
      </div>
      <ul
        className={classNames(
          isMenuShow ? styles.navbarLinksShow : styles.navbarLinksContainer,
        )}
      >
        {HEADER_LINKS.map((link: any) => (
          <li key={link.title}>
            <Button
              onClick={() => setIsMenuShow(false)}
              variant="link"
              href={link.href}
              text={link.title}
            />
          </li>
        ))}
        <li className={classNames(user?.uid && styles.desktopOnly)}>
          <Button
            variant="secondary"
            className={styles.userButton}
            popoverTarget={user?.uid ? 'user-menu' : undefined}
            onClick={
              user?.uid
                ? undefined
                : () => (router.push('/authenticate'), setIsMenuShow(false))
            }
            text={
              loading
                ? '...'
                : user
                  ? (user?.displayName?.split(' ')[0] ?? '')
                  : 'Sign in'
            }
          />
          {user?.uid && <UserMenuDropDown />}
        </li>
        {user?.uid && (
          <>
            <li className={styles.mobileOnly}>
              <Button
                variant="link"
                href={'/user/profile/' + user.uid}
                text="Profile"
              />
            </li>
            <li className={styles.mobileOnly}>
              <button
                type="button"
                className={styles.logout}
                onClick={signOutUser}
              >
                Log out
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
