// Hero.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLImageElement> &
      React.ImgHTMLAttributes<HTMLImageElement>
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  ) => <img {...props} />, // Mock Next.js Image component
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('Hero component', () => {
  it('renders Hero component correctly', () => {
    render(<Hero />)

    // Check if the image is rendered
    const image = screen.getByAltText('berat image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/map-track-green.png')
    expect(image).toHaveAttribute('width', '500')
    expect(image).toHaveAttribute('height', '500')

    // Check if the button is rendered
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})
