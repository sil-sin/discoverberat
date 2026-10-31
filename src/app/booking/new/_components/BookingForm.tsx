import React, { FC, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthContext } from '@/lib/auth/auth-provider'
import classnames from 'classnames'
import styles from './BookingForm.module.css'
import { Input } from '@/components/ui/Input'
import { REQUIRED } from '@/lib/forms'
import { MAX_TEXT_LENGTH, MIN_GUESTS } from '@/lib/booking'
interface BookingFormProps {
  className?: string
  onSubmit: (formData: any) => void
  onGuestsChange?: (guests: number) => void
  isLoading?: boolean
  booker?: string
  guestNumber: number
  pickup?: string
  email: string | null
  phone?: string
  isPrivate?: boolean
  maxGuests?: number
}

export const BookingForm: FC<BookingFormProps> = forwardRef((props, ref) => {
  const { className, onSubmit, onGuestsChange, isPrivate, maxGuests } = props
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
    validate: () => trigger(undefined, { shouldFocus: true }),
  }))

  return (
    <div className={classnames(styles.bookingFormContainer, className)}>
      <form data-testid='booking-form' onSubmit={handleSubmit(onSubmit)}>
        <Input
          label='Full name'
          data-testid='booker'
          placeholder='Name for the booking'
          id='booker'
          autoComplete='name'
          maxLength={MAX_TEXT_LENGTH}
          isRequired
          error={errors.booker?.message}
          {...register('booker', { required: REQUIRED })}
        />
        <Input
          label='Email'
          data-testid='email'
          type='email'
          id='email'
          readOnly
          hint='From your account. We send your booking confirmation here.'
          error={errors.email?.message}
          {...register('email', { required: REQUIRED })}
        />
        <Input
          label='Phone'
          placeholder='+355 69 123 4567'
          type='tel'
          autoComplete='tel'
          id='phone'
          isRequired
          error={errors.phone?.message}
          {...register('phone', {
            required: REQUIRED,
            pattern: {
              value: /^(?=(?:\D*\d){7})\+?[\d\s()-]{7,20}$/,
              message: 'Enter a valid phone number',
            },
          })}
        />
        <Input
          label='Pickup place'
          placeholder='Hotel or address in Berat'
          id='pickup'
          maxLength={MAX_TEXT_LENGTH}
          isRequired
          error={errors.pickup?.message}
          {...register('pickup', { required: REQUIRED })}
        />
        <Input
          label='Guests'
          placeholder='2'
          min={MIN_GUESTS}
          max={maxGuests}
          type='number'
          list='guestNumbers'
          id='guestNumber'
          isRequired
          error={errors.guestNumber?.message}
          {...register('guestNumber', {
            valueAsNumber: true,
            required: REQUIRED,
            min: { value: MIN_GUESTS, message: `Guests must be at least ${MIN_GUESTS}` },
            ...(maxGuests && {
              max: { value: maxGuests, message: `Only ${maxGuests} places are left at this time` },
            }),
            onChange: (event) => {
              const guests = event.target.valueAsNumber
              if (guests >= MIN_GUESTS) onGuestsChange?.(guests)
            },
          })}
        />
        <datalist id='guestNumbers'>
          {!isPrivate && <option value={2} />}
          {[...Array(isPrivate ? 9 : 8)].map((_, index) => (
            <option key={index + 3} value={index + 3}>
              {index + 3}
            </option>
          ))}
        </datalist>
      </form>
    </div>
  )
})

BookingForm.displayName = 'BookingForm'

