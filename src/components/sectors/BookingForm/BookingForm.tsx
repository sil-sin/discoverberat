import React, { FC, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthContext } from '@/utils/auth/auth-provider'
import classnames from 'classnames'
import styles from './BookingForm.module.css'
import Toast from '@/components/simple/Toast'
interface BookingFormProps {
  className?: string
  onSubmit: (formData: any) => void
  isLoading?: boolean
  booker?: string
  guestNumber: number
  pickup?: string
  email: string | null
  phone?: string
  isPrivate?: boolean
}

const BookingForm: FC<BookingFormProps> = forwardRef((props, ref) => {
  const { className, onSubmit, isPrivate } = props
  const { user } = useAuthContext()

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormProps>({
    mode: 'onChange',
    defaultValues: {
      booker: user?.displayName ?? '',
      guestNumber: 2,
      email: user?.email ?? '',
      phone: '',
      isPrivate: isPrivate || false,
      pickup: 'Discover Berat office',
    },
  })

  const [booker, guestNumber, pickup, email, phone] = watch([
    'booker',
    'guestNumber',
    'pickup',
    'email',
    'phone',
  ])

  useEffect(() => {
    if (user?.displayName) {
      setValue('booker', user?.displayName)
      setValue('email', user?.email)
    }
  }, [setValue, user?.displayName, user?.email])

  const getFormData = () => ({
    booker,
    guestNumber,
    isPrivate,
    pickup,
    email,
    phone,
  })

  useImperativeHandle(ref, () => ({
    getFormData,
    validate: trigger,
  }))

  return (
    <div className={classnames(styles.bookingFormContainer, className)}>
      <h2>Booking information</h2>
      <form data-testid='booking-form' onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='booker'>Booker name:</label>
        <div>
          <input
            data-testid='booker'
            placeholder='Enter a name for the booking'
            type='text'
            id='booker'
            {...register('booker', {
              required: 'Booker name field is required',
            })}
          />
          {errors.booker?.message && (
            <Toast
              data-testid='booker-error'
              isTextOnly
              isError
              message={errors.booker.message ?? 'Something went wrong!'}
            />
          )}
        </div>
        <label htmlFor='email'>Booker email:</label>
        <div>
          <input
            data-testid='email'
            placeholder='Enter an email for the booking'
            type='email'
            id='email'
            {...register('email', {
              required: 'Booker email field is required',
            })}
          />
          {errors.email?.message && (
            <Toast
              data-testid='email-error'
              isTextOnly
              isError
              message={errors.email.message ?? 'Something went wrong!'}
            />
          )}
        </div>
        <label htmlFor='phone'>Booker phone:</label>
        <div>
          <input
            placeholder='Enter a phone number, e.g. +355 69 123 4567'
            type='tel'
            autoComplete='tel'
            id='phone'
            {...register('phone', {
              required: 'Booker phone field is required',
              pattern: {
                value: /^\+?[\d\s()-]{7,20}$/,
                message: 'Enter a valid phone number',
              },
            })}
          />
          {errors.phone?.message && (
            <Toast
              isTextOnly
              isError
              message={errors.phone.message ?? 'Something went wrong!'}
            />
          )}
        </div>
        <label htmlFor='pickup'>Pickup place:</label>
        <div>
          <input
            placeholder='Enter a pickup place'
            type='text'
            id='pickup'
            {...register('pickup', { required: 'Pickup field is required' })}
          />
          {errors.pickup?.message && (
            <Toast
              isTextOnly
              isError
              message={errors.pickup.message ?? 'Something went wrong!'}
            />
          )}
        </div>
        <label htmlFor='guestNumber'> Guests:</label>
        <div>
          <input
            placeholder='Enter number of guests'
            min={2}
            type='number'
            list='guestNumbers'
            {...register('guestNumber', {
              valueAsNumber: true,
              required: 'Guests must be at least 2',
              min: { value: 2, message: 'Guests must be at least 2' },
            })}
            id='guestNumber'
          />
          <datalist id='guestNumbers'>
            {!isPrivate && <option value={2} />}
            {[...Array(isPrivate ? 9 : 8)].map((_, index) => (
              <option key={index + 3} value={index + 3}>
                {index + 3}
              </option>
            ))}
          </datalist>
          {errors.guestNumber?.message && (
            <Toast
              isTextOnly
              isError
              message={errors.guestNumber.message ?? 'Something went wrong!'}
            />
          )}
        </div>
      </form>
    </div>
  )
})

BookingForm.displayName = 'BookingForm'

export default BookingForm
