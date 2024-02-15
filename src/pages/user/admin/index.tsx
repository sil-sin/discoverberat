import React, { useState, useEffect } from 'react'
import styles from './admin.module.css'

import PreviewTab from './Preview'
import dynamic from 'next/dynamic'
import classNames from 'classnames'
import { adminSDK } from '../../api/adminConfig'
import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import * as admin from 'firebase-admin'

const EditCreateTab = dynamic(() => import('./ContentTabs'), {
  ssr: false,
})

function Index() {
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx)

    const adminToken = await adminSDK.auth().verifyIdToken(cookies.token)
    // the user is authenticated!
    const { uid, email } = adminToken

    if (email === process.env.NEXT_PUBLIC_ADMIN) {
      return {
        props: {
          message: `Your email is ${email} and your UID is ${uid}.`,
          uid,
          adminToken,
        },
      }
    } else {
      return { redirect: { destination: '/', permanent: false } }
    }
  } catch (err: any) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    ctx.res.writeHead(302, { Location: '/' })
    ctx.res.end()

    // `as never` prevents inference issues
    // with InferGetServerSidePropsType.
    // The props returned here don't matter because we've
    // already redirected the user.

    return {
      props: {
        message: err.message ?? '',
      },
    }
  }
}

export default Index
