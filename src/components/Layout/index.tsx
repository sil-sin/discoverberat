import { Navigation } from '@/components/sectors/Navigation/Navigation'
import type { GetServerSideProps, Metadata } from 'next'
import { Inter } from 'next/font/google'
import { FC, ReactNode, useMemo } from 'react'
import { Footer } from '../sectors/Footer/Footer'
import Head from 'next/head'
import React from 'react'
import { getAllEntries } from '@/contentful/contentful'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Discover Berat',
  description: 'Discover Berat with our customized guided tours',
}

type Props = {
  children: ReactNode
  pageTitle?: string
  user?: any
  tours?: any
}

const Layout: FC<Props> = ({ children, pageTitle, user, tours }) => {
  const title = useMemo(() => pageTitle || 'Discover Berat', [pageTitle])

  return (
    <main>
      <Head>
        <title>{title}</title>
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <Navigation />
      {children}
      <Footer />
    </main>
  )
}

// export const getServerSideProps: GetServerSideProps = async ({}) => {
//   const entries: any = await getAllEntries()
//   const tours =
//     entries.filter((e: any) => e?.sys.contentType?.sys.id === 'tourPage') ||
//     null

//   return {
//     props: {
//       tours: tours,
//     },
//   }
// }

export default Layout
