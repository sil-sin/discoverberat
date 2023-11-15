import React, { useState, useEffect } from 'react'
import styles from './user.module.css'

import withLayout from '@/utils/auth/withLayout'

import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import Image from 'next/image'
import { adminSDK } from '@/pages/api/adminConfig'

function ProfilePage({ user }: any) {
  // Callback function to update form data in the parent
  console.log(user)

  return (
    <div className={styles.container}>
      <Image src={user?.picture} alt={user.name} width={50} height={50} />
      <h1 className={styles.title}>{'Welcome, ' + user?.name || ''}</h1>
      <p>{'Logged in with ' + user?.firebase?.sign_in_provider || ''}</p>
      <p className={styles.email}>{'Email: ' + user?.email || ''}</p>
    </div>
  )
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
  params: any
) => {
  try {
    const cookies = nookies.get(ctx)
    const authenticatedUser = await adminSDK.auth().verifyIdToken(cookies.token)

    return {
      props: {
        user: authenticatedUser,
      },
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in getServerSideProps:', error)

    // Redirect logic or show an error message to the user
    ctx.res.writeHead(302, { Location: '/' })
    ctx.res.end()

    return {
      props: {
        error: 'Authentication failed.',
      },
    }
  }
}

export default withLayout(ProfilePage, true, 'Profile')
