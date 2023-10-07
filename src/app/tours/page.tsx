import styles from './page.module.css'
import Tours from '@/components/sectors/Tours/Tours'
export default function Page() {
  return (
    <div className={styles.container}>
      <Tours />
    </div>
  )
}
