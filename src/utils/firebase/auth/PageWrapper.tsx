import { ComponentType, FC, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useAuthContext } from './useAuth'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'

type PageWrapperProps = {
  children: ReactNode
  pageTitle?: string
  isPrivate?: boolean
  sessionUser?: User | null
}

const PageWrapper: FC<PageWrapperProps> = ({ children, pageTitle }) => {
  const { user } = useAuthContext()

  return (
    <Layout user={user} pageTitle={pageTitle}>
      {children}
    </Layout>
  )
}

export default PageWrapper
