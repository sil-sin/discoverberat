'use client'
import Button from '@/components/simple/Button'
import React, { useEffect, useRef, useState } from 'react'
import styles from './new.module.css'

import { GetServerSidePropsContext } from 'next'
import { getEntriesByType } from '@/utils/contentful/contentful'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import app from '@/utils/firebase/firebaseConfig'
import { useAuthContext } from '@/utils/auth/auth-provider'
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import { getTimes } from '@/helpers/getTimes'
import BookingForm from '@/components/sectors/BookingForm/BookingForm'
import { getFirestore as getFirestoreAdmin } from 'firebase-admin/firestore'
import { useRouter } from 'next/router'
import { adminSDK, initializeAdmin } from '@/pages/api/adminConfig'
import { stringify } from 'querystring'
import useSaveLater from '@/hooks/useSaveLater'
import Modal from '@/components/Modal'
import Toast from '@/components/simple/Toast'

const startDay = new Date().setDate(new Date().getDate() + 1)
const startDateObject = new Date(startDay)

function New({ booking, unavailableDates }: any) {
  const [selectedDate, setSelectedDate] = useState<Date>(startDateObject)
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)
  const [availableTimes, setAvailableTimes] = useState<any>([])
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [isShowModal, setIsShowModal] = useState<boolean>(false)
  const [warning, setWarning] = useState<boolean>(false)
  const router = useRouter()

  const bookingFormRef = useRef<any>()
  const { user } = useAuthContext()

  const tourUrl = '/authenticate?callbackUrl=/booking/new?tour=' + booking.url

  const { handleSaveLater, isSuccess, isTouched } = useSaveLater(
    { ...booking, id: user?.uid },
    tourUrl
  )
  const currentDay = new Date().setDate(new Date().getDate() + 1)

  const {
    id,
    title,
    price,
    currency = '€',
    description,
    url,
    isDayTrip,
    type,
  } = booking

  useEffect(() => {
    if (isSuccess) {
      setIsShowModal(isSuccess)
    } else {
      setIsShowModal(false)
      setWarning(isTouched)
    }
  }, [isSuccess, isTouched])

  useEffect(() => {
    setTimeout(() => {
      setWarning(false)
    }, 5000)
  }, [warning])

  useEffect(() => {
    if (!isDayTrip) {
      const times: any = getTimes(selectedDate)

      setAvailableTimes(times)
    }
  }, [isDayTrip, selectedDate])

  const handleBookNow = async (isBookNow: boolean) => {
    if (!user) {
      return router.replace(
        '/authenticate?callbackUrl=/booking/new?tour=' + url
      )
    }

    const formData = await bookingFormRef.current.getFormData()

    const bookingData = {
      type,
      title,
      price,
      currency,
      isPaid: false,
      bookingId: id,

      ...formData,
      uid: user?.uid,
      date: selectedDateTime,
    }

    const db = getFirestore(app)

    const isInvalid = !formData.booker || !formData.guestNumber
    if (!selectedDate) return alert('Please select a date')
    if (isInvalid) return alert('Please fill in all fields')

    if (
      unavailableDates?.filter(
        (date: any) => date === selectedDate?.toLocaleString()
      ).length <= 5
    ) {
      await addDoc(collection(db, 'unavailableDates'), {
        uid: user?.uid,
        date: selectedDate?.toLocaleString('en-GB'),
      })
    }

    // if (isBookNow && formData.guestNumber > 1) {
    //   const queryString = stringify(bookingData)
    //   router.push('/booking/new/payment?' + queryString)
    // }

    const subject = `New booking from ${bookingData.booker} on ${bookingData.date}`
    const message = `Hi,<p> I'm ${bookingData.booker} and I just reserved this tour:</p> ${title} on ${bookingData.date} for ${bookingData.guestNumber} guests. I'll be in touch with you soon.`
    const bookingConfirmationSubject = `Booking confirmation:  ${title} on ${bookingData.date} for ${bookingData.guestNumber} guests`
    const bookingConfirmationMessage = `Dear ${bookingData.booker}, <p>Thank you for you reservation of  ${title} on ${bookingData.date} for ${bookingData.guestNumber} guests. <p>See you soon !</p>`

    if (formData.guestNumber && !isBookNow) {
      await addDoc(collection(db, 'bookings'), bookingData).then(
        async (res) => {
          // await addDoc(collection(db, 'mail'), {
          //   to: bookingData.email,
          //   message: {
          //     subject: bookingConfirmationSubject,
          //     html: bookingConfirmationMessage,
          //   },
          // })
          // await addDoc(collection(db, 'mail'), {
          //   to: process.env.NEXT_PUBLIC_ADMIN,
          //   message: {
          //     subject: subject,
          //     html: message,
          //   },
          // })
          router.push('new/thank-you?id=' + res.id)
        }
      )
    }

    return
  }

  const handleAvailability = (date: Date) => {
    setSelectedDate(date)
  }

  const nextDay = new Date(currentDay)
  const handleModalClose = () => {
    setIsShowModal(false)
    const urlWithoutHash = router.asPath.split('#')[0]
    router.replace(urlWithoutHash)
  }

  const handleTimeSelection = (selectedTime: string) => {
    // Combine selectedDate and selectedTime to create the new selectedDateTime
    const [hours, minutes] = selectedTime.split(':')
    const newDateTime = selectedDate && new Date(selectedDate.getTime())

    // Set the hours and minutes of the new date time
    if (newDateTime) {
      newDateTime.setHours(+hours)
      newDateTime.setMinutes(+minutes)
    }

    // Custom format the date string without seconds
    const formattedDateTime = `${newDateTime?.toDateString()} ${newDateTime?.toLocaleTimeString(
      [],
      { hour: '2-digit', minute: '2-digit' }
    )}`

    // Update selectedDateTime
    setSelectedDateTime(newDateTime)
  }

  return (
    <div>
      {isShowModal && (
        <Modal
          id='success'
          onClose={handleModalClose}
          withCTA={true}
          modalTitle={'Success'}
          modalDescription={'Your booking has been saved on your profile'}
        />
      )}
      <div onClick={() => setIsShowModal(false)}>
        <div className={styles.container}>
          <h2> {title} </h2>
          <div>
            <div>
              {description?.split('.')[0]}.
              <Button
                className={styles.link}
                variant='link'
                href={`/tours/${url}`}
              >
                Read more
              </Button>
            </div>
          </div>

          <div className={styles.bookingForm}>
            <div className={styles.calendar}>
              <ReactCalendar
                tileDisabled={({ date }) => {
                  return unavailableDates.filter(
                    (d: any) => d === date.toLocaleString('en-GB')
                  ).length
                }}
                value={selectedDate}
                minDate={nextDay}
                onClickDay={handleAvailability}
              />
              <>
                {selectedDate &&
                availableTimes &&
                availableTimes.length &&
                !isDayTrip ? (
                  <ul className={styles.timesContainer}>
                    <p>Select starting time</p>
                    <div className={styles.times}>
                      {availableTimes.map((time: any) => (
                        <li key={time}>
                          <Button
                            className={styles.timeButton}
                            variant='tertiary'
                            onClick={() => handleTimeSelection(time)}
                          >
                            {time}
                          </Button>
                        </li>
                      ))}
                    </div>
                  </ul>
                ) : null}
              </>
            </div>
            <BookingForm
              // @ts-ignore
              ref={bookingFormRef}
              booker={user?.displayName ?? ''}
              onSubmit={handleBookNow}
              guestNumber={0}
              isValid={false}
              isPrivate={isPrivate}
              email={user?.email ?? ''}
            />
          </div>

          {/* <div className={styles.bookingOptions}> */}
          {/* <div className={styles.bookOption}>
              <div>
                <h3>
                  PRIVATE TOUR
                  <br />
                  {currency}
                  {price}.00
                  <br />
                  PER PERSON
                  <hr />
                </h3>
                <div>
                  <p>Minimum booking requirement: 2 persons.</p>
                  <hr />
                  <p>Online payment option available for your convenience.</p>
                </div>
              </div>
              <Button
                variant='primary'
                onClick={() => {
                  setIsPrivate(true)
                  handleBookNow(true)
                }}
              >
                Book Now
              </Button>
            </div> */}
          <div className={styles.bookOption}>
            <div>
              <h2>Book now, pay on location.</h2>
              <hr />
              <h3>
                {currency}
                {price}/PERSON
              </h3>
              <p>Minimum booking requirement: 2 persons.</p>
            </div>

            <Button
              isDisabled={!selectedDateTime && !isDayTrip}
              variant='primary'
              onClick={() => {
                setIsPrivate(false)
                handleBookNow(false)
              }}
            >
              Reserve Now
            </Button>
            <Button onClick={handleSaveLater} variant='secondary'>
              Save for later
            </Button>
            {!isSuccess && warning && (
              <Toast
                withCLoseButton={false}
                onClose={() => setWarning(false)}
                message='Already saved in your profile'
                isInfo
              />
            )}
          </div>

          {/* <div className={styles.bookOption}>
              <p>
                Save for later (
                <em>
                  This option will not reserve the selected service for you.
                </em>
                )
              </p>
              <Button onClick={handleSaveLater} variant='secondary'>
                Save for later
              </Button>
            </div> */}
          {/* </div> */}
          <div>
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({
  query,
  res,
}: GetServerSidePropsContext) => {
  const CACHE_TIME_SECONDS = 12 * 60 * 60 // 12 hours
  // Set caching headers for the response
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${CACHE_TIME_SECONDS}, stale-while-revalidate=59`
  )

  const tourData: any =
    query.tour &&
    (await getEntriesByType('tourPage')).find(
      (tour) => tour.fields.url === query.tour
    )

  const serviceData =
    query.service &&
    (await getEntriesByType('serviceCard')).find(
      (service) => service.fields.url === query.service
    )

  if (!adminSDK) {
    initializeAdmin()
  }

  const db = getFirestoreAdmin()
  const unavailableDatesCollection = db.collectionGroup('unavailableDates')

  const unavailableDates = await unavailableDatesCollection.get()

  const dateCountMap = new Map()

  unavailableDates.docs.forEach((doc) => {
    const date = doc.data().date

    if (dateCountMap.has(date)) {
      dateCountMap.set(date, dateCountMap.get(date) + 1)
    } else {
      dateCountMap.set(date, 1)
    }
  })

  const datesWithMoreThanTwoOccurrences = Array.from(dateCountMap.entries())
    .filter(([date, count]) => count > 2)
    .map(([date]) => date)

  if (serviceData) {
    return {
      props: {
        booking: {
          ...serviceData.fields,
          id: serviceData.sys.id,
          type: 'service',
        },
        unavailableDates: datesWithMoreThanTwoOccurrences,
      },
    }
  }
  if (tourData) {
    return {
      props: {
        booking: { ...tourData.fields, id: tourData.sys.id, type: 'tour' },
        unavailableDates: datesWithMoreThanTwoOccurrences,
      },
    }
  }
}

export default New
