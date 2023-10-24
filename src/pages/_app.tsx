import { AppProps } from 'next/app';
import { getContentEntries } from '../contentful/contentful'; // Adjust the import path as needed
import Layout from '@/components/Layout';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

MyApp.getInitialProps = async () => {
  // Call your API function to fetch entries
  const entries = await getContentEntries('tourPage');

  // Return entries along with pageProps
  return { entries };
};

export default MyApp;
