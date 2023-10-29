import React from 'react'
import styles from './admin.module.css'
import EditCreateTab from './ContentTabs'
export default function index() {
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
