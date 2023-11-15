import { Navigation } from '@/components/sectors/Navigation/Navigation'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { FC, ReactNode, useMemo } from 'react'
import { Footer } from '../sectors/Footer/Footer'
import Head from 'next/head'
import React from 'react'
import { User } from 'firebase/auth'

export const metadata: Metadata = {
  title: 'Discover Berat',
  description: 'Discover Berat with our customized guided tours',
}

type Props = {
  children: ReactNode
  pageTitle?: string
  user: User | null
  loading: boolean
}

export const Layout: FC<Props> = ({ children, pageTitle, user, loading }) => {
  const title = useMemo(() => pageTitle || 'Discover Berat', [pageTitle])

  return (
    <main>
      <Head>
        <title>{title}</title>
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <Navigation
        userName={user?.displayName ?? ''}
        isLoggedIn={!!user}
        isLoading={loading}
      />
      {children}
      <Footer />
    </main>
  )
}
