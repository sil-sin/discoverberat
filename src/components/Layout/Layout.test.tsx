import { render, screen } from '@testing-library/react'
import { Layout } from './Layout'
import { AuthProvider } from '@/utils/auth/auth-provider'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/utils/auth/auth-provider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuthContext: () => ({ user: null, loading: false }),
}))
jest.mock('@/utils/auth/signOut', () => ({ signOutUser: jest.fn() }))
jest.mock('@/components/ContactForm/actions', () => ({
  sendContactMessage: jest.fn(),
}))

describe('Layout Component', () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    ;(useRouter as jest.Mock).mockClear()
  })

  it('renders without crashing', () => {
    ;(useRouter as jest.Mock).mockReturnValue({
      query: { callbackUrl: '/some/callback/url' },
    })

    render(
      <AuthProvider>
        <Layout>
          <div data-testid='test-child'>Test Child</div>
        </Layout>
      </AuthProvider>
    )
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
  })
})
