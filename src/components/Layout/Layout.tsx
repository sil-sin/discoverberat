import { Navigation } from '@/components/sectors/Navigation/Navigation'
import type { Metadata } from 'next'
import { FC, ReactNode, useMemo } from 'react'
import { Footer } from '../sectors/Footer/Footer'
import Head from 'next/head'
import React from 'react'

import ContactForm from '../ContactForm/ContactForm'
import Link from 'next/link'
import Image from 'next/image'
import CookieBanner from '../CookieBanner/CookieBanner'
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
      <Link
        href='https://wa.me/355692921203'
        className='whatsapp-button'
        target='_blank'
      >
        <div className='whatsapp-icon-container'>
          <Image
            className='whatsapp-icon'
            width={40}
            height={40}
            src='/whatsapp-icon.svg'
            alt={'whatsapp icon'}
          />
        </div>
      </Link>
      <ContactForm />
      <CookieBanner />
      <Footer />
    </main>
  )
}
