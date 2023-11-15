import styles from './index.module.css'
import Tours from '../../components/sectors/Tours'
import { GetServerSideProps } from 'next'
import { getEntriesByType } from '@/utils/contentful/contentful'
import withLayout from '@/utils/auth/withLayout'
import { useAuthContext } from '@/utils/auth/useAuth'

function Page({ tours }: any) {
  const { user, loading } = useAuthContext()

  if (loading) {
    // Render loading state if necessary
    return <div>Loading...</div>
  }

  if (!user) {
    // Redirect or show login screen if the user is not logged in
    return (
      <div className={styles.noUser}>
        <h2> User not logged in redirecting to homepage</h2>
      </div>
    )
  }

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

export default withLayout(Page, true, 'Tours')
