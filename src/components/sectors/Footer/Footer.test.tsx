import React from 'react'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer Component', () => {
  test('renders the Instagram link', () => {
    render(<Footer />)
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument()
  })

  test('contains "Cookies policy" link', () => {
    render(<Footer />)
    expect(screen.getByText('Cookies policy')).toBeInTheDocument()
  })

  test('contains "Privacy policy" link', () => {
    render(<Footer />)
    expect(screen.getByText('Privacy policy')).toBeInTheDocument()
  })
})
