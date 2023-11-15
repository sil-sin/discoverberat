import { FC, ReactNode, useEffect } from 'react'
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

const PageWrapper: FC<PageWrapperProps> = ({
  children,
  pageTitle,
  isPrivate,
}) => {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (!user && isPrivate) router.push('/')
    })
  }, [isPrivate, router, user])

  return (
    <Layout user={user} pageTitle={pageTitle} loading={loading}>
      {children}
    </Layout>
  )
}

export default PageWrapper
