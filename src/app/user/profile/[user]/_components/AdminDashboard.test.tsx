import React from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { AdminDashboard } from './AdminDashboard'
import { toast } from '@/components/ui/Toast'

const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()

// Mock bookings data for testing
const bookings = [
  {
    id: 'b1',
    uid: '1',
    startsAt: daysFromNow(60),
    title: 'Booking 1',
    pickup: 'Location 1',
    email: 'test1@example.com',
    date: '2024-05-08',
    isPaid: true,
    booker: 'Booker 1',
    currency: '$',
    price: 100,
    guestNumber: 2,
  },
]

// Mock user data for testing
const user = {
  displayName: 'Test User',
  email: 'test@example.com',
}

describe('AdminDashboard component', () => {
  test('renders AdminDashboard component', () => {
    render(<AdminDashboard bookings={bookings} user={user} />)
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
  })

  test('renders user data when user is provided', () => {
    render(<AdminDashboard bookings={bookings} user={user} />)

    expect(screen.getByTestId('admin-dashboard-user-data')).toBeInTheDocument()
    // Check if user data is rendered
    expect(screen.getByTestId('admin-dashboard-user-email')).toHaveTextContent(
      'test@example.com'
    )
  })

  test('renders an overview card per tab that opens the tab', () => {
    render(<AdminDashboard bookings={bookings} user={user} />)

    expect(screen.getByText('Upcoming').nextSibling).toHaveTextContent('1')
    expect(screen.getAllByText('Booking 1')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: /Manage availability/ }))
    expect(screen.getByRole('tab', { name: 'Availability' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Availability' })).toHaveFocus()
  })

  test('renders "No upcoming bookings" when no bookings are provided', () => {
    render(<AdminDashboard bookings={[]} user={user} />)

    expect(screen.getAllByText('No upcoming bookings')).toHaveLength(2)
  })

  test('switches panels with the side tabs', () => {
    render(<AdminDashboard bookings={bookings} user={user} />)

    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toBeVisible()
    fireEvent.click(screen.getByRole('tab', { name: /Bookings/ }))
    expect(screen.getByRole('tabpanel', { name: /Bookings/ })).toBeVisible()
    expect(screen.queryByRole('tabpanel', { name: 'Overview' })).not.toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('tab', { name: /Bookings/ }), { key: 'ArrowDown' })
    expect(screen.getByRole('tab', { name: 'History' })).toHaveAttribute('aria-selected', 'true')
  })

  test('blocks a day from the availability calendar', async () => {
    const setDateBlocked = jest.fn().mockResolvedValue(undefined)
    const { container } = render(
      <AdminDashboard bookings={bookings} user={user} setDateBlocked={setDateBlocked} />
    )

    fireEvent.click(screen.getByRole('tab', { name: 'Availability' }))
    expect(within(screen.getByRole('tabpanel')).getByText('No blocked dates')).toBeInTheDocument()
    const days = container.querySelectorAll('.react-calendar__tile:not([disabled])')
    fireEvent.click(days[days.length - 1])
    const [dateKey, isBlocked] = setDateBlocked.mock.calls[0]
    expect(dateKey).toMatch(/^\d{2}\/\d{2}\/\d{4}, 00:00:00$/)
    expect(isBlocked).toBe(true)
    expect(await screen.findByRole('button', { name: 'Unblock' })).toBeInTheDocument()
  })

  test('shows booking history per tour and month', () => {
    const history = [
      { tourId: 't1', title: 'City Tour', month: '2026-01', bookings: 2, guests: 5, revenue: 125 },
      { tourId: 't1', title: 'City Tour', month: '2026-03', bookings: 1, guests: 2, revenue: 50 },
      { tourId: 't2', title: 'Canyon Trip', month: '2026-03', bookings: 4, guests: 9, revenue: 405 },
    ]
    render(<AdminDashboard bookings={[]} user={user} history={history} />)
    fireEvent.click(screen.getByRole('tab', { name: 'History' }))

    expect(screen.getByRole('button', { name: 'Feb 2026: 0 bookings' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Mar 2026: 5 bookings' }))
    expect(screen.getByRole('heading', { name: 'Mar 2026' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Canyon Trip 4' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'City Tour 1' }))
    expect(screen.getByRole('heading', { name: 'City Tour · Mar 2026' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Guests' }))
    expect(screen.getByRole('row', { name: /^City Tour/ })).toHaveTextContent('City Tour5–27')
    expect(screen.getByRole('row', { name: /All tours/ })).toHaveTextContent('All tours501116')
  })

  test('warns before blocking a day that has bookings', async () => {
    const confirm = jest.spyOn(toast, 'confirm').mockResolvedValue(false)
    const setDateBlocked = jest.fn()
    const today = { ...bookings[0], startsAt: new Date().toISOString() }
    const { container } = render(
      <AdminDashboard bookings={[today]} user={user} setDateBlocked={setDateBlocked} />
    )

    fireEvent.click(container.querySelector('.react-calendar__tile--now')!)
    await waitFor(() => expect(confirm).toHaveBeenCalledWith(expect.stringContaining('has 1 booking.'), 'Block anyway'))
    expect(setDateBlocked).not.toHaveBeenCalled()
    confirm.mockRestore()
  })
})
