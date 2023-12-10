import { AppProps } from 'next/app'

import '@/styles/globals.css'
import { AuthProvider } from '@/utils/auth/auth-provider'
import Layout from '@/components/Layout'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PayPalScriptProvider
        options={{
          clientId:
           // 'AR5wf3gr3axLp275ZSchrfU6axYzthlt4e18UAAi4ozk29A6DUATHWFk5z2Pup8pD7hTPaoX7O_pZhvQ',sandbox albania merchant t dont work
            'Ab8otBDkLujI7OcxXXOaIRquZQApPP-ypUa4lqpJ3L7y7P-JZZZVE45rQIF3rrX8-V-1c5h8LM3R-BJj',
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PayPalScriptProvider>
    </AuthProvider>
  )
}
