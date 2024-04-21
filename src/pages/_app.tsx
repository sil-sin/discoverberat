import { AppProps } from 'next/app'
// import '@mantine/core/styles.css'
// import { createTheme, MantineProvider } from '@mantine/core'

import '@/styles/globals.css'
import { AuthProvider } from '@/utils/auth/auth-provider'
import Layout from '@/components/Layout'
export default function App({ Component, pageProps }: AppProps) {
  // const theme = createTheme({
  //   /** Put your mantine theme override here */
  // })

  return (
    <AuthProvider>
      {/* <MantineProvider theme={theme}> */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* </MantineProvider> */}
    </AuthProvider>
  )
}
