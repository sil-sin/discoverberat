import styles from './index.module.css'
import Tours from '@/components/sectors/Tours/Tours'
export default function Page({entries}) {
alert(entries)
  return (
    <div className={styles.container}>
      <Tours />
    </div>
  )
}
