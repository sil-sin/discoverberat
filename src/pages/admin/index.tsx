import React from 'react'
import styles from './admin.module.css'
export default function index() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Panel</h1>
      <section className={styles.section}>
        <aside className={styles.leftPanel}>
          <main className={styles.rightPanel}></main>
        </aside>
      </section>
    </div>
  )
}
