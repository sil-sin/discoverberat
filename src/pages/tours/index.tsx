import styles from './index.module.css'
import Tours from '@/components/sectors/Tours/Tours'
export default function Page({entries}:{entries:any}) {
!entries && <>No entry</>
  

  
  return (
    <div className={styles.container}>
      <Tours />
      <>{entries?.[0]?.fields.title}</>
    </div>
  )
}
