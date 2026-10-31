import { useAuthContext } from '@/lib/auth/auth-provider'
import { FC } from 'react'
import styles from './UserMenuDropDown.module.css'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { signOutUser } from '@/lib/auth/sign-out'
export const UserMenuDropDown: FC<any> = () => {
  const { user } = useAuthContext()

  return (
    <div
      id='user-menu'
      popover='auto'
      className={styles.userMenuContainer}
      onClick={(event) => event.currentTarget.hidePopover()}
    >
      <Button variant='link' href={'/user/profile/' + user?.uid}>
        Profile
      </Button>
      <Button
        variant='tertiary'
        onClick={() => {
          signOutUser()
        }}
      >
        Logout
      </Button>
    </div>
  )
}
