import React from 'react'
import { render, screen } from '@testing-library/react'
import Dashboard from './Dashboard'

describe('Dashboard component', () => {
  test('renders Dashboard component', () => {
    render(
      <Dashboard
        bookings={[]}
        savedItems={[]}
        user={{ displayName: 'Test User', email: 'test@example.com' }}
      />
    )
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  test('renders user data when user is provided', () => {
    render(
      <Dashboard
        bookings={[]}
        savedItems={[]}
        user={{ displayName: 'Test User', email: 'test@example.com' }}
      />
    )

    expect(screen.getByTestId('contact-details-table')).toBeInTheDocument()
    expect(screen.getByText('User data')).toBeInTheDocument()
    expect(screen.getByText('Full name')).toBeInTheDocument()
    expect(screen.getByText('E-mail')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  test('renders "No upcoming booking" when no bookings are provided', () => {
    render(
      <Dashboard
        bookings={[]}
        savedItems={[]}
        user={{ displayName: 'Test User', email: 'test@example.com' }}
      />
    )

    expect(screen.getByTestId('upcoming-booking')).toBeInTheDocument()
    expect(screen.getByText('Upcoming booking')).toBeInTheDocument()
    expect(screen.getByText('No upcoming booking')).toBeInTheDocument()
  })

  test('renders upcoming booking when bookings are provided', () => {
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

    render(
      <Dashboard
        bookings={bookings}
        savedItems={[]}
        user={{ displayName: 'Test User', email: 'test@example.com' }}
      />
    )

    expect(screen.getByTestId('upcoming-booking')).toBeInTheDocument()
    expect(screen.getByText('Upcoming booking')).toBeInTheDocument()
    expect(screen.getByText('Booking name')).toBeInTheDocument()
    expect(screen.getByText('Pickup')).toBeInTheDocument()
    expect(screen.getByText('Date and Time')).toBeInTheDocument()
  })
})
