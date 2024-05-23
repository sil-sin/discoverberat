import { AppProps } from 'next/app'

import '@/styles/globals.css'
import { AuthProvider } from '@/utils/auth/auth-provider'
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps) {

  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}
