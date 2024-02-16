import { useAuthContext } from '@/utils/auth/auth-provider'
import { FC, use, useEffect, useState } from 'react'
import styles from './UserMenuDropDown.module.css'
import Link from 'next/link'
import Button from '@/components/simple/Button'
import { signOutUser } from '@/utils/auth/signOut'
export const UserMenuDropDown: FC<any> = () => {
  const { user } = useAuthContext()

  return (
    <div className={styles.userMenuContainer}>
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
