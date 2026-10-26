import { Navigation } from '@/components/sectors/Navigation/Navigation'
import { FC, ReactNode } from 'react'
import { Footer } from '../sectors/Footer/Footer'
import React from 'react'

import ContactForm from '../ContactForm/ContactForm'
import Link from 'next/link'
import Image from 'next/image'
import CookieBanner from '../CookieBanner/CookieBanner'

type Props = {
  children: ReactNode
}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <main>
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
