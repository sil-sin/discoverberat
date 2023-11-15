import { AppProps } from 'next/app'

import '@/styles/globals.css'
import { AuthProvider } from '@/utils/auth/useAuth'

export default function App({ Component, pageProps }: AppProps) {
  console.log(pageProps)

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
