import Layout from '@/components/Layout'
import { AuthProvider } from '@/utils/auth/auth-provider'
import { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Discover Berat - Tour Operator',
  description:
    'Discover the charm, embrace the stories, and make memories that last a lifetime. Welcome to Discover Berat - Where Every Journey Tells a Tale.',
  openGraph: {
    title: 'Discover Berat - Tour Operator',
    description:
      'Discover the charm, embrace the stories, and make memories that last a lifetime. Welcome to Discover Berat - Where Every Journey Tells a Tale.',
    url: 'https://discoverberat.com/',
    siteName: 'Discover Berat',
    images: [
      {
        url: 'https://images.ctfassets.net/vzi02yirpwbf/5IgNZ5fK06tYapDIIs6bjO/6da1941f117f3cdafd4a0a5374023e23/favicon.ico',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Berat - Tour Operator',
    description:
      'Discover the charm, embrace the stories, and make memories that last a lifetime. Welcome to Discover Berat - Where Every Journey Tells a Tale.',
    images: [
      'https://images.ctfassets.net/vzi02yirpwbf/5IgNZ5fK06tYapDIIs6bjO/6da1941f117f3cdafd4a0a5374023e23/favicon.ico',
    ],
  },
  other: {
    charSet: 'UTF-8',
  },
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  )
}
