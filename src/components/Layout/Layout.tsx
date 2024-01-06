import { Navigation } from '@/components/sectors/Navigation/Navigation'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { FC, ReactNode, useMemo } from 'react'
import { Footer } from '../sectors/Footer/Footer'
import Head from 'next/head'
import React from 'react'
import { User } from 'firebase/auth'
import { useAuthContext } from '@/utils/auth/auth-provider'
import ContactForm from '../ContactForm/ContactForm'
import { Link } from 'next/link'

export const metadata: Metadata = {
  title: 'Discover Berat',
  description: 'Discover Berat with our customized guided tours',
}

type Props = {
  children: ReactNode
  pageTitle?: string
}

export const Layout: FC<Props> = ({ children, pageTitle }) => {
  const title = useMemo(() => pageTitle || 'Discover Berat', [pageTitle])

  return (
    <main>
      <Head>
        <title>{title}</title>
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <Navigation className='navigationBar' />
      <div style={{ marginTop: '80px' }}>{children}</div>
      <Link href='https://wa.me/1XXXXXXXXXXX' className='whatsapp-button' target='_blank'>WhatsApp</Link>
      <ContactForm />
      <Footer />
    </main>
  )
}
