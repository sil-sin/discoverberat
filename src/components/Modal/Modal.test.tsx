import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './Modal'

describe('Modal component', () => {
  it('renders modal with title and description', () => {
    render(
      <Modal
        withCTA={true}
        modalTitle='Test Title'
        modalDescription='Test Description'
        className='testClass'
        id='testId'
        modalCta={[{ ctaText: 'Test CTA', ctaUrl: '/test-url' }]}
        onClose={() => {}}
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('triggers onClose function on close button click', () => {
    const onCloseMock = jest.fn()
    render(
      <Modal
        withCTA={true}
        modalTitle='Test Title'
        modalDescription='Test Description'
        className='testClass'
        id='testId'
        modalCta={[{ ctaText: 'Test CTA', ctaUrl: '/test-url' }]}
        onClose={onCloseMock}
      />
    )

    fireEvent.click(screen.getByRole('button'))
    expect(onCloseMock).toHaveBeenCalled()
  })

  it('renders CTA links correctly', () => {
    render(
      <Modal
        withCTA={true}
        modalTitle='Test Title'
        modalDescription='Test Description'
        className='testClass'
        id='testId'
        modalCta={[{ ctaText: 'Test CTA', ctaUrl: '/test-url' }]}
        onClose={() => {}}
      />
    )

    const ctaLink = screen.getByText('Test CTA')
    expect(ctaLink).toBeInTheDocument()
    expect(ctaLink).toHaveAttribute('href', '/test-url')
  })
})
