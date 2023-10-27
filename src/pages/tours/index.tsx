import styles from './index.module.css'
import Tours from '../../components/sectors/Tours'
import { GetServerSideProps } from 'next'
import { getEntry } from '@/contentful/contentful'

export default function Page({ tours }: any) {
  console.log(tours)

  return (
    <div className={styles.container}>
      {tours ? <Tours tours={tours} /> : <>No tours</>}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const entries = await getEntry('tourPage')
    console.log(entries)

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
