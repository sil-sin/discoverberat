import React from 'react'
import { render, screen } from '@testing-library/react'
import Dashboard from './Dashboard'

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))
jest.mock('@/utils/payment/paypal', () => () => null)
jest.mock('@/utils/payment/actions', () => ({ cancelBooking: jest.fn() }))
jest.mock('@/utils/auth/auth-provider', () => ({ useAuthContext: () => ({ user: null }) }))

const user = { displayName: 'Test User', email: 'test@example.com' }
const booking = {
  id: 'booking-1',
  uid: '1',
  title: 'Booking 1',
  pickup: 'Location 1',
  date: 'Fri, 30 October 2026, 10:00',
  startsAt: '2026-10-30T09:00:00.000Z',
  isPaid: true,
  booker: 'Booker 1',
  currency: '€',
  price: 30,
  guestNumber: 2,
}

describe('Dashboard component', () => {
  test('renders Dashboard component', () => {
    render(<Dashboard bookings={[]} savedItems={[]} user={user} />)
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  test('renders empty states when nothing is booked or saved', () => {
    render(<Dashboard bookings={[]} savedItems={[]} user={user} />)

    expect(screen.getByText('You have no upcoming tours.')).toBeInTheDocument()
    expect(screen.getByText('Tours you save for later show up here.')).toBeInTheDocument()
  })

  test('renders the next booking as a ticket and later bookings as rows', () => {
    render(
      <Dashboard
        bookings={[booking, { ...booking, id: 'booking-2', title: 'Booking 2', isPaid: false, guestNumber: 1 }]}
        savedItems={[]}
        user={user}
      />
    )

    expect(screen.getByText('Booking 1')).toBeInTheDocument()
    expect(screen.getByText('€60')).toBeInTheDocument()
    expect(screen.getByText('Paid')).toBeInTheDocument()
    expect(screen.getByText('Later bookings')).toBeInTheDocument()
    expect(screen.getByText('Booking 2')).toBeInTheDocument()
    expect(screen.getByText('Pay on location')).toBeInTheDocument()
    expect(screen.getAllByText('Pay now')).toHaveLength(1)
    expect(screen.getAllByText('Google Calendar')[0]).toHaveAttribute(
      'href',
      expect.stringContaining('dates=20261030T090000Z%2F20261030T120000Z')
    )
  })

  test('shows Cancel booking only when allowed and marks pending refunds', () => {
    render(
      <Dashboard
        bookings={[
          { ...booking, cancellationRequested: true },
          { ...booking, id: 'booking-2', canCancel: true },
        ]}
        savedItems={[]}
        user={user}
      />
    )

    expect(screen.getByText('Refund pending')).toBeInTheDocument()
    expect(screen.getAllByText('Cancel booking')).toHaveLength(1)
  })
})
