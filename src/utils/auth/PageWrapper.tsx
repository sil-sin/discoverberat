import { FC, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useAuthContext } from './useAuth'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'

type PageWrapperProps = {
  children: ReactNode
  pageTitle?: string
}

const PageWrapper: FC<PageWrapperProps> = ({ children, pageTitle }) => {
  const { user, loading } = useAuthContext()

  return (
    <Layout user={user} pageTitle={pageTitle} loading={loading}>
      {children}
    </Layout>
  )
}

export default PageWrapper
