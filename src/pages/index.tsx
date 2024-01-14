import Hero from '../components/sectors/Hero/index'
import OurServices from '@/components/sectors/OurServices'

import Tours from '@/components/sectors/Tours'
import { Transfers } from '@/components/sectors/Transfers/Transfers'
import { getEntriesByType } from '@/utils/contentful/contentful'
import { GetServerSideProps } from 'next'

function Home(props: any) {
  const { tours, transfers } = props
  if (!tours || !transfers) return

  return (
    <main className={'main'}>
      <Hero />
      <OurServices />
      <Transfers transfers={[...transfers]} />
      <Tours tours={tours} />
    </main>
  )
}

const CACHE_TIME_SECONDS = 12 * 60 * 60; // 12 hours

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Set caching headers for the response
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${CACHE_TIME_SECONDS}, stale-while-revalidate=59`
  );

  try {
    // Your data fetching logic here
    const tours = await getEntriesByType('tourPage');
    const transfers = await getEntriesByType('transfers');
    const services = await getEntriesByType('serviceCard');

    return {
      props: {
        tours,
        transfers,
        services,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        tours: null,
        transfers: null,
        services: null,
      },
    };
  }
};


export default Home
