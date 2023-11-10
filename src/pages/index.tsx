import Hero from '../components/sectors/Hero/index'
import OurServices from '@/components/sectors/OurServices'

import Tours from '@/components/sectors/Tours'
import { Transfers } from '@/components/sectors/Transfers/Transfers'
import { getEntriesByType } from '@/utils/contentful/contentful'
import { GetServerSideProps } from 'next'

export default function Home(props: any) {
  const { tours, transfers } = props
  console.log('transfers:', typeof transfers, { transfers })

  return (
    <main className={'main'}>
      <Hero />
      <OurServices />
      <Transfers transfers={...transfers} />
      <Tours tours={tours} />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({}) => {
  try {
    const tours = await getEntriesByType('tourPage')
    const transfers = await getEntriesByType('transfers')
    const services = await getEntriesByType('serviceCard')
    console.log('here', transfers)

    return {
      props: { tours, transfers, services },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: { tours: null, transfers: null, services: null },
    }
  }
}
