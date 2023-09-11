import dynamic from 'next/dynamic'
import styles from './page.module.css'

export default function Home() {
  const ComponentWithNoSSR = dynamic(() => import('../components/Video'), {
    ssr: false,
  })

  return (
    <main className={styles.main}>
      <h2>Discover Berat is coming soon . . .</h2>
      <div className={styles.video}>
        {/* <ComponentWithNoSSR /> */}
      </div>
    </main>
  )
}
