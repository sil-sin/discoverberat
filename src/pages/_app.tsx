import { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import '@/styles/globals.css'
import { AuthProvider } from '@/utils/firebase/auth/useAuth'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
