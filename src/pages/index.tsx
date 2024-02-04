import Hero from '../components/sectors/Hero/index'
import OurServices from '@/components/sectors/OurServices'

import Tours from '@/components/sectors/Tours'
import { Transfers } from '@/components/sectors/Transfers/Transfers'
import Button from '@/components/simple/Button'
import { getEntriesByType } from '@/utils/contentful/contentful'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

function Home(props: any) {
  const { tours, transfers } = props
  const router = useRouter()

  if (!tours || !transfers) return

  const topTours = tours?.filter((tour: any) =>
    tour.fields?.category?.includes('top')
  )

  return (
    <main className='main'>
      <Hero />
      <OurServices />
      <Tours tours={topTours} pageTitle={'Top Tours'} />

      <Button
        className='viewAll'
        variant='tertiary'
        onClick={() => {
          router.push('/tours')
        }}
      >
        View all tours
      </Button>
      <Transfers transfers={[...transfers]} />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const CACHE_TIME_SECONDS = 12 * 60 * 60 // 12 hours
  // Set caching headers for the response
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${CACHE_TIME_SECONDS}, stale-while-revalidate=59`
  )

  try {
    // Your data fetching logic here
    const tours = await getEntriesByType('tourPage')
    const transfers = await getEntriesByType('transfers')
    const services = await getEntriesByType('serviceCard')

    return {
      props: {
        tours,
        transfers,
        services,
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        tours: null,
        transfers: null,
        services: null,
      },
    }
  }
}

export default Home
