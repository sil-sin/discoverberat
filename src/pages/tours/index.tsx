import styles from './index.module.css'
import Tours from '../../components/sectors/Tours/Tours'

export default function Page({ entries }: { entries: any }) {
  !entries && <>No entry</>
  const tours = entries?.filter(
    (e: any) => e?.sys.contentType?.sys.id === 'tourPage'
  )
  return (
    <div className={styles.container}>
      <Tours tours={tours} />
      </div>
  )
}
