import React, { useState, useEffect } from 'react'
import styles from './admin.module.css'

import PreviewTab from './Preview'
import dynamic from 'next/dynamic'
import classNames from 'classnames'

const EditCreateTab = dynamic(() => import('./ContentTabs'), {
  ssr: false,
})

export default function Index() {
  const [selectedContentType, setSelectedContentType] = useState<any>()
  const [previewContent, setPreviewContent] = useState<any>()
  const [previewLoading, setPreviewLoading] = useState(false)
  const [formData, setFormData] = useState<any>() // Initialize form data state

  // Callback function to update form data in the parent
  const handleFormChange = (newFormData: any) => {
    setFormData(newFormData)
  }

  const handlePreviewClick = (description: any, imgUrl: any) => {
    setPreviewLoading(true)

    setPreviewContent({ ...formData, description, imgUrl })

    // if (!!(selectedContentType && previewContent)) {
    //   setPreviewLoading(false)
    // } else {
    setPreviewLoading(false)
    //   return alert('no preview available')
    // }
  }
  const handleContentTypeChange = (
    selectedContentType: React.SetStateAction<string>
  ) => {
    setSelectedContentType(selectedContentType)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Panel</h1>
      <section className={styles.section}>
        <aside className={styles.leftPanel}>
          <EditCreateTab
            onFormChange={handleFormChange}
            selectedContentType={selectedContentType}
            onContentTypeChange={handleContentTypeChange}
            onPreviewClick={handlePreviewClick}
          />
        </aside>
        <main className={styles.rightPanel}>
          <h3>Preview</h3>
          <PreviewTab
            entryId={selectedContentType}
            previewContent={previewContent}
            previewLoading={previewLoading}
          />
        </main>
      </section>
    </div>
  )
}
