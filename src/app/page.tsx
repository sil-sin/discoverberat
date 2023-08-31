import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Explore Berat is coming soon . . .</h1>
      <video autoPlay loop muted>
        <source src='/loadingplane.webm' type='video/webm' />
      </video>
    </main>
  )
}
