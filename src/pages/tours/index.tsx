import styles from './index.module.css'
import Tours from '../../components/sectors/Tours'
import { GetServerSideProps } from 'next'
import { getEntriesByType } from '@/utils/contentful/contentful'

function Page({ tours }: any) {
  return (
    <div className={styles.container}>
      {tours ? <Tours tours={tours} pageTitle={'Our tours'} /> : <>No tours</>}
    </div>
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
    const entries = await getEntriesByType('tourPage')

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

export default Page
