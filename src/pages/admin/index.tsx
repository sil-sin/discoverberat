import React from 'react'
import styles from './admin.module.css'

import dynamic from 'next/dynamic'
export default function index() {
  const EditCreateTab = dynamic(() => import('./ContentTabs'), {
    ssr: false,
  })

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Panel</h1>
      <section className={styles.section}>
        <aside className={styles.leftPanel}>
          <h3>
            <EditCreateTab />
          </h3>
        </aside>
        <main className={styles.rightPanel}>Preview</main>
      </section>
    </div>
  )
}
