import { AppProps } from 'next/app'

import '@/styles/globals.css'
import { AuthProvider } from '@/utils/auth/useAuth'
import PageWrapper from '@/utils/auth/PageWrapper'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PageWrapper>
        <Component {...pageProps} />
      </PageWrapper>
    </AuthProvider>
  )
}
