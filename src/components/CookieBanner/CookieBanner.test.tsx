import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CookieBanner from './CookieBanner'

describe('CookieBanner', () => {
  test('renders the cookie banner ', () => {
    render(<CookieBanner />)
    const cookieBanner = screen.getByTestId('cookie-banner')
    expect(cookieBanner).toBeInTheDocument()
  })

  test('calls hideBanner when the hide button is clicked', () => {
    render(<CookieBanner />)
    const hideButton = screen.getByRole('button')
    const cookieBanner = screen.getByTestId('cookie-banner')
    fireEvent.click(hideButton)
    expect(cookieBanner).not.toBeInTheDocument()
  })
})
