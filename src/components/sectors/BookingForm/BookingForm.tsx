import React, {
  FC,
  forwardRef,
  useImperativeHandle,
  useState,
  ChangeEvent,
} from 'react'

interface BookingFormProps {
  className?: string
  onSubmit: (formData: any) => void
  onBack: () => void
  onContinue: () => void
  isLoading?: boolean
  booker?: string
  guestNumber: number
  isValid: boolean
  isPrivate?: boolean
}

const BookingForm: FC<BookingFormProps> = forwardRef((props, ref) => {
  const {
    className,
    booker = '',
    guestNumber = 2,
    onSubmit,
    onBack,
    onContinue,
    isLoading = true,
    isValid = false,
    isPrivate = true,
  } = props

  const [formData, setFormData] = useState({
    booker: booker,
    guestNumber: isPrivate ? 2 : 1,
    isPrivate: true,
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const getFormData = () => formData

  useImperativeHandle(ref, () => ({
    getFormData,
  }))

  return (
    <div className={className}>
      <h2>Booking information</h2>
      <form>
        <label htmlFor='booker'>Booker:</label>
        <input
          type='text'
          id='booker'
          name='booker'
          value={formData.booker}
          onChange={handleInputChange}
        />
        <div>
          <input
            type='radio'
            id='privateTour'
            name='tourType'
            value='private'
            defaultChecked={true}
            onChange={handleInputChange}
          />
          <label htmlFor='privateTour'>
            Private Tour
            <p>
              Exclusive experience for you and your group. Minimum booking for 2
              people.
            </p>
          </label>
        </div>

        <div>
          <input
            type='radio'
            id='nonPrivateTour'
            name='tourType'
            value='nonPrivate'
            onChange={handleInputChange}
          />
          <label htmlFor='nonPrivateTour'>
            Non-Private Tour
            <p>
              This option allows you to join other participants, and you might
              enjoy price reductions. (Online payment not available)
            </p>
          </label>
          <label htmlFor='guestNumber'> Guests:</label>
          <input
            type='number'
            min={isPrivate ? 2 : 1}
            id='guestNumber'
            name='guestNumber'
            value={formData.guestNumber}
            onChange={handleInputChange}
          />
        </div>
      </form>
    </div>
  )
})

BookingForm.displayName = 'BookingForm'

export default BookingForm
