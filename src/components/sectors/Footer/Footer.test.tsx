import React from 'react'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer Component', () => {
  test('renders social media links correctly', () => {
    render(<Footer />)
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument()
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument()
    expect(screen.getByLabelText('Linkedin')).toBeInTheDocument()
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument()
    expect(screen.getByLabelText('TikTok')).toBeInTheDocument()
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
