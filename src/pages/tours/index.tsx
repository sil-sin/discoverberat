import styles from './index.module.css'
import Tours from '../../components/sectors/Tours'
import { GetServerSideProps } from 'next'
import { getEntriesByType } from '@/utils/contentful/contentful'

function Page({ tours }: any) {
  return (
    <div className={styles.container}>
      {tours ? <Tours tours={tours} /> : <>No tours</>}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
