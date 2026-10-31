import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BookingForm } from './BookingForm'
import { useAuthContext } from '@/lib/auth/auth-provider'

// Mock the useAuthContext hook
jest.mock('@/lib/auth/auth-provider', () => ({
  useAuthContext: jest.fn(),
}))

describe('BookingForm component', () => {
  const mockSubmit = jest.fn()
  const mockUser = { displayName: 'John Doe', email: 'john@example.com' }

  beforeEach(() => {
    ;(useAuthContext as jest.Mock).mockReturnValue({ user: mockUser })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with default values and user data', () => {
    render(
      <BookingForm
        onSubmit={mockSubmit}
        guestNumber={2}
        email={mockUser.email}
        booker={mockUser.displayName}
      />
    )

    expect(screen.getByTestId('booker')).toHaveValue(mockUser.displayName)
    expect(screen.getByTestId('email')).toHaveValue(mockUser.email)
    expect(screen.getByLabelText(/guests/i)).toHaveValue(2)
    expect(screen.getByLabelText(/pickup place/i)).toHaveValue(
      'Discover Berat office'
    )
  })

  it('shows validation errors when required fields are empty', async () => {
    render(
      <BookingForm
        onSubmit={mockSubmit}
        guestNumber={2}
        email={mockUser.email}
      />
    )

    // Clear required fields to trigger validation errors
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByLabelText(/^phone/i), {
      target: { value: 'abc' },
    })
    fireEvent.change(screen.getByLabelText(/pickup place/i), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByLabelText(/guests/i), { target: { value: 1 } })

    fireEvent.submit(screen.getByTestId('booking-form'))

    await waitFor(() => {
      expect(screen.getAllByText('This field is mandatory.')).toHaveLength(3)
      expect(screen.getByText('Enter a valid phone number')).toBeInTheDocument()
      expect(screen.getByText('Guests must be at least 2')).toBeInTheDocument()
    })
  })

  it('submits the form with correct data', async () => {
    render(
      <BookingForm
        onSubmit={mockSubmit}
        guestNumber={2}
        email={mockUser.email}
      />
    )

    fireEvent.change(screen.getByTestId('booker'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'jane@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^phone/i), {
      target: { value: '+355 69 123 4567' },
    })
    fireEvent.change(screen.getByLabelText(/pickup place/i), {
      target: { value: 'Hotel' },
    })
    fireEvent.change(screen.getByLabelText(/guests/i), { target: { value: 3 } })

    fireEvent.submit(screen.getByTestId('booking-form'))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          booker: 'Jane Doe',
          guestNumber: 3,
          isPrivate: false,
          pickup: 'Hotel',
          email: 'jane@example.com',
          phone: '+355 69 123 4567',
        },
        expect.anything()
      )
    })
  })
})
