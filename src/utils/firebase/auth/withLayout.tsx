import { ComponentType, FC } from 'react'
import PageWrapper from './PageWrapper'

const withLayout = <T extends object>(
  Component: ComponentType<T>,
  isPrivate: boolean,
  pageTitle?: string
): FC<T> => {
  const LayoutWrapper: FC<T> = (props: T) => {
    return (
      <PageWrapper
        isPrivate={isPrivate}
        pageTitle={pageTitle ?? 'Discover Berat'}
        {...props}
      >
        <Component {...props} />
      </PageWrapper>
    )
  }

  return LayoutWrapper
}

export default withLayout
