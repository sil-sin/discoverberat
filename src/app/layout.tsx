import { Navigation } from '@/components/sectors/Navigation/Navigation'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Discover Berat',
  description: 'Discover Berat with our customized guided tours',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
