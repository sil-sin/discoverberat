import Hero from '../components/sectors/Hero/index'
import OurServices from '@/components/sectors/OurServices'

import Tours from '@/components/sectors/Tours'
import { Transfers } from '@/components/sectors/Transfers/Transfers'
import { getEntriesByType } from '@/utils/contentful/contentful'
import { useAuthContext } from '@/utils/firebase/auth/useAuth'
import { GetServerSideProps } from 'next'
import { withLayout } from '../utils/firebase/auth/PageWrapper'

function Home(props: any, user: any) {
  const { tours, transfers } = props

  console.log({ props, user })

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

export default withLayout(Home, false, 'Discover Berat')
