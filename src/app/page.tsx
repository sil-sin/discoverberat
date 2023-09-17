import dynamic from 'next/dynamic'
import styles from './page.module.css'
import Hero from '../components/sectors/Hero/index'
import Tours from '@/components/sectors/Tours/Tours'

export default function Home() {
  const Video = dynamic(() => import('../components/Video'), {
    ssr: false,
  })
  const loading = false

  if (loading) {
    return (
      <main className={styles.main}>
        <h2>Discover Berat is coming soon . . .</h2>
        <div className={styles.video}>
          <Video />
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <Hero />
      <Tours />
    </main>
  )
}
