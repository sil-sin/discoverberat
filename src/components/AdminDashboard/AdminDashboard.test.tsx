import React from 'react'
import { render, screen } from '@testing-library/react'
import AdminDashboard from './AdminDashboard'

// Mock bookings data for testing
const bookings = [
  {
    uid: '1',
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

  test('renders upcoming booking when bookings are provided', () => {
    render(<AdminDashboard bookings={bookings} user={user} />)

    // Check if upcoming booking is rendered
    expect(screen.getByText('Upcoming booking')).toBeInTheDocument()
    expect(
      screen.getByTestId('admin-dashboard-upcoming-booking-name')
    ).toHaveTextContent('Booking 1')
  })

  test('renders "No upcoming booking" when no bookings are provided', () => {
    render(<AdminDashboard bookings={[]} user={user} />)

    // Check if "No upcoming booking" message is rendered
    expect(screen.getByText('No upcoming booking')).toBeInTheDocument()
  })

  test('renders all bookings when bookings are provided', () => {
    render(<AdminDashboard bookings={bookings} user={user} />)

    // Check if all bookings are rendered
    expect(screen.getByText('All bookings')).toBeInTheDocument()
    // expect(screen.getByText('Booking 1')).toBeInTheDocument()
    // expect(screen.getByText('Location 1')).toBeInTheDocument()
    // expect(screen.getByText('test1@example.com')).toBeInTheDocument()
  })
})
