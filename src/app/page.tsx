import dynamic from 'next/dynamic'
import styles from './page.module.css'
import Button from '@/components/simple/Button'

export default function Home() {
  const ComponentWithNoSSR = dynamic(() => import('../components/Video'), {
    ssr: false,
  })

  return (
    <main className={styles.main}>
      <h2>Explore Berat is coming soon . . .</h2>
      <div className={styles.video}>
        <ComponentWithNoSSR />
      </div>
    </main>
  )
}
