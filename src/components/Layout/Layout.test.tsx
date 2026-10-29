import { act, fireEvent, render, screen } from '@testing-library/react'
import { toast } from '@/components/simple/Toast'
import { Layout } from './Layout'
import { AuthProvider } from '@/utils/auth/auth-provider'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: () => '/',
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

  it('shows toasts and resolves confirm toasts with the answer', async () => {
    render(
      <Layout>
        <div />
      </Layout>
    )

    act(() => toast.error('Something broke'))
    expect(screen.getByText('Something broke')).toBeInTheDocument()

    let answer: Promise<boolean> = Promise.resolve(false)
    act(() => {
      answer = toast.confirm('Cancel this booking?', 'Cancel booking')
    })
    fireEvent.click(screen.getByText('Cancel booking'))
    await expect(answer).resolves.toBe(true)
    expect(screen.queryByText('Cancel this booking?')).not.toBeInTheDocument()
  })
})
