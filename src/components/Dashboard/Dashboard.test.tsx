import React from 'react'
import { render, screen, act, within } from '@testing-library/react'
import Dashboard from './Dashboard'

// Mock data
const mockUser = {
  uid: '123',
  displayName: 'Test User',
  email: 'test@example.com',
  emailVerified: true,
  photoURL: null,
  phoneNumber: null,
  disabled: false,
}

const mockBooking = {
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
}

const mockSavedItem = {
  id: '1',
  title: 'Saved Item 1',
  currency: '$',
  price: 150,
}

// Mock any required providers/context
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
    }
  },
}))

// Helper function to render component
const renderDashboard = async (props: any) => {
  let rendered: any
  await act(async () => {
    rendered = render(<Dashboard {...props} />)
  })
  return rendered
}

describe('Dashboard component', () => {
  test('renders Dashboard component with basic user data', async () => {
    await renderDashboard({
      bookings: [],
      savedItems: [],
      user: mockUser,
      isAdmin: false,
    })

    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('contact-details-table')).toBeInTheDocument()
  })

  test('renders user data correctly', async () => {
    await renderDashboard({
      bookings: [],
      savedItems: [],
      user: mockUser,
      isAdmin: false,
    })

    const contactDetails = screen.getByTestId('contact-details-table')
    expect(within(contactDetails).getByText('User data')).toBeInTheDocument()
    expect(within(contactDetails).getByText('Full name')).toBeInTheDocument()
    expect(within(contactDetails).getByText('E-mail')).toBeInTheDocument()
    expect(within(contactDetails).getByText('Test User')).toBeInTheDocument()
    expect(
      within(contactDetails).getByText('test@example.com')
    ).toBeInTheDocument()
  })

  test('does not render booking sections when no bookings are provided', async () => {
    await renderDashboard({
      bookings: [],
      savedItems: [],
      user: mockUser,
      isAdmin: false,
    })

    expect(screen.queryByText('Upcoming booking')).not.toBeInTheDocument()
    expect(screen.queryByText('Bookings')).not.toBeInTheDocument()
  })

  test('renders booking sections when bookings are provided', async () => {
    await renderDashboard({
      bookings: [mockBooking],
      savedItems: [],
      user: mockUser,
      isAdmin: false,
    })

    // Check for upcoming booking section
    const upcomingSection = screen.getByTestId('upcoming-booking')
    expect(upcomingSection).toBeInTheDocument()
    expect(
      within(upcomingSection).getByText('Upcoming booking')
    ).toBeInTheDocument()

    // Check for booking details in the upcoming booking table
    const upcomingTable = within(upcomingSection).getByRole('table')
    expect(within(upcomingTable).getByText('Booking name')).toBeInTheDocument()
    expect(within(upcomingTable).getByText('Pickup')).toBeInTheDocument()
    expect(within(upcomingTable).getByText('Date and Time')).toBeInTheDocument()
    expect(within(upcomingTable).getByText('Booking 1')).toBeInTheDocument()
    expect(within(upcomingTable).getByText('Location 1')).toBeInTheDocument()
    expect(within(upcomingTable).getByText('2024-05-08')).toBeInTheDocument()
  })

  test('does not render saved items section for admin users', async () => {
    await renderDashboard({
      bookings: [mockBooking],
      savedItems: [mockSavedItem],
      user: mockUser,
      isAdmin: true,
    })

    expect(screen.queryByText('Saved items')).not.toBeInTheDocument()
  })

  test('renders saved items section for non-admin users when items exist', async () => {
    await renderDashboard({
      bookings: [],
      savedItems: [mockSavedItem],
      user: mockUser,
      isAdmin: false,
    })

    const savedItemsElements = screen.getAllByText('Saved Item 1')
    expect(savedItemsElements.length).toBeGreaterThan(0)
    expect(screen.getByText(/\$150/)).toBeInTheDocument()
  })

  test('renders complete dashboard for non-admin users with both bookings and saved items', async () => {
    const { container } = await renderDashboard({
      bookings: [mockBooking],
      savedItems: [mockSavedItem],
      user: mockUser,
      isAdmin: false,
    })

    // Check bookings section
    const bookingsSection = screen
      .getAllByText('Bookings')[0]
      .closest('section')
    expect(bookingsSection).toBeInTheDocument()
    if (bookingsSection) {
      expect(within(bookingsSection).getByText('Booking 1')).toBeInTheDocument()
    }

    // Check saved items section
    const savedItemsSection = screen.getByText('Saved items').closest('section')
    expect(savedItemsSection).toBeInTheDocument()
    if (savedItemsSection) {
      expect(
        within(savedItemsSection).getByText('Saved Item 1')
      ).toBeInTheDocument()
    }
  })

  test('renders admin view with only bookings section', async () => {
    await renderDashboard({
      bookings: [mockBooking],
      savedItems: [mockSavedItem],
      user: mockUser,
      isAdmin: true,
    })

    // Check bookings section exists
    const bookingsSection = screen.getByText('Bookings').closest('section')
    expect(bookingsSection).toBeInTheDocument()
    if (bookingsSection) {
      expect(within(bookingsSection).getByText('Booking 1')).toBeInTheDocument()
    }

    // Check saved items are not rendered
    expect(screen.queryByText('Saved items')).not.toBeInTheDocument()
  })
})
