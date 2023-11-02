import Hero from '../components/sectors/Hero/index'
import OurServices from '@/components/sectors/OurServices'

import Tours from '@/components/sectors/Tours'
import { getEntry } from '@/utils/contentful/contentful'
import { GetServerSideProps } from 'next'

export default function Home(props: any) {
  const { tours } = props

  return (
    <main className={'main'}>
      <Hero />
      <OurServices />
      <Tours tours={tours} />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const entries = await getEntry('tourPage')

    return {
      props: { tours: entries },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: { tours: null },
    }
  }
}
