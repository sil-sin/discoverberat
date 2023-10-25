import { AppProps } from 'next/app'
import { getAllEntries, getSpecificEntry } from '../contentful/contentful' // Adjust the import path as needed
import Layout from '@/components/Layout'
import '@/styles/globals.css'

function App({ Component, pageProps }: AppProps) {
  
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

App.getInitialProps = async () => {
  // Call your API function to fetch entries
  const entries = await getAllEntries()

  // Return entries within pageProps
  return { pageProps: { entries } }
}

export default App
