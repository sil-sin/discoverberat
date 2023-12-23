import React, { FC, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CustomError } from '@/utils/types'
import { useAuthContext } from '@/utils/auth/auth-provider'
import classnames from 'classnames'
import styles from './BookingForm.module.css'
interface BookingFormProps {
  className?: string
  onSubmit: (formData: any) => void
  error: CustomError
  isLoading?: boolean
  booker?: string
  guestNumber: number
  pickup?: string
  isPrivate?: boolean
}

const BookingForm: FC<BookingFormProps> = forwardRef((props, ref) => {
  const { className, onSubmit, isPrivate } = props
  const { user } = useAuthContext()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<BookingFormProps>({
    defaultValues: {
      booker: user?.displayName ?? '',
      guestNumber: 1,
      isPrivate: isPrivate || false,
      pickup: 'Discover Berat office',
    },
  })

  const [booker, guestNumber, pickup] = watch([
    'booker',
    'guestNumber',
    'pickup',
  ])

  useEffect(() => {
    if (user?.displayName) {
      setValue('booker', user?.displayName)
    }
  }, [user?.displayName])

  useEffect(() => {
    if (!guestNumber || (isPrivate && guestNumber < 2)) {
      setError('guestNumber', {
        type: 'custom',
        message: `Guests must be at least ${isPrivate ? '2' : '1'}`,
      })
    } else {
      setError('guestNumber', {})
    }
    if (!booker) {
      setError('booker', {
        type: 'custom',
        message: 'Booker field is required',
      })
    } else {
      setError('booker', {})
    }

    if (!pickup) {
      setError('booker', {
        type: 'custom',
        message: 'Booker field is required',
      })
    }
  }, [booker, guestNumber, isPrivate, pickup, setError])

  const getFormData = () => ({
    booker,
    guestNumber,
    isPrivate,
    pickup,
  })

  useImperativeHandle(ref, () => ({
    getFormData,
  }))

  return (
    <div className={classnames(styles.bookingFormContainer, className)}>
      <h2>Booking information</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='booker'>Booker:</label>
        <input
          type='text'
          id='booker'
          {...register('booker', { required: 'Booker field is required' })}
        />
        {errors.booker && <p>{errors.booker.message}</p>}
        <label htmlFor='pickup'>Pickup place:</label>
        <input
          type='text'
          id='pickup'
          {...register('pickup', { required: 'Pickup field is required' })}
        />
        {errors.pickup && <p>{errors.pickup.message}</p>}
        <div>
          <label htmlFor='guestNumber'> Guests:</label>
          <input
            min={isPrivate ? 2 : 1}
            type='number'
            list='guestNumbers'
            {...register('guestNumber', {
              required: 'Guest number field is required',
            })}
            id='guestNumber'
          />
          <datalist id='guestNumbers'>
            {!isPrivate && <option value={1} />}
            {[...Array(isPrivate ? 9 : 8)].map((_, index) => (
              <option key={index + 2} value={index + 2}>
                {index + 2}
              </option>
            ))}
          </datalist>
          {errors.guestNumber && <p>{errors.guestNumber.message}</p>}
        </div>
      </form>
    </div>
  )
})

BookingForm.displayName = 'BookingForm'

export default BookingForm
