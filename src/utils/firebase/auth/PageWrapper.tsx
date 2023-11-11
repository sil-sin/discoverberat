import { ComponentType, FC, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useAuthContext } from './useAuth'

type PageWrapperProps = {
  children: ReactNode
  pageTitle?: string
  isPrivate?: boolean
}

const PageWrapper: FC<PageWrapperProps> = ({
  children,
  pageTitle,
  isPrivate,
}) => {
  const router = useRouter()
  const { user, loading } = useAuthContext()

  if (loading) {
    return <>Loading</>
  }

  if (isPrivate && !user) {
    router.push('/')
  }

  return (
    <Layout user={user} pageTitle={pageTitle}>
      {children}
    </Layout>
  )
}

export const withLayout = <T extends object>(
  Component: ComponentType<T>,
  isPrivate: boolean,
  pageTitle?: string
): FC<T> => {
  const LayoutWrapper: FC<T> = (props: T) => {
    return (
      <PageWrapper
        isPrivate={isPrivate}
        pageTitle={pageTitle ?? 'SilverCode'}
        {...props}
      >
        <Component {...props} />
      </PageWrapper>
    )
  }

  return LayoutWrapper
}
