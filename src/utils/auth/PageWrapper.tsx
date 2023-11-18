import { FC, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useAuthContext } from './auth-provider'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'

type PageWrapperProps = {
  children: ReactNode
  pageTitle?: string
}

const PageWrapper: FC<PageWrapperProps> = ({ children }) => {
  const { user, loading } = useAuthContext()

  return (
    <Layout user={user} loading={loading}>
      {children}
    </Layout>
  )
}

export default PageWrapper
