import { Navigation } from '@/components/sectors/Navigation/Navigation'
import { FC, ReactNode } from 'react'
import { Footer } from '../sectors/Footer/Footer'
import React from 'react'

import Link from 'next/link'
import Image from 'next/image'
import CookieBanner from '../CookieBanner/CookieBanner'
import { WHATSAPP_URL } from '../sectors/Navigation/utils'
import { Toaster } from '../simple/Toast'

type Props = {
  children: ReactNode
}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <main
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}
    >
      <Navigation className='navigationBar' />
      <div style={{ marginTop: '80px', flex: 1 }}>{children}</div>
      <Link
        href={WHATSAPP_URL}
        aria-label='Chat with us on WhatsApp'
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
      <CookieBanner />
      <Toaster />
      <Footer />
    </main>
  )
}
