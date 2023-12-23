'use client'
import Button from '@/components/simple/Button'
import React, { useEffect, useRef, useState } from 'react'
import styles from './new.module.css'

import { GetServerSidePropsContext } from 'next'
import { getEntriesByType } from '@/utils/contentful/contentful'
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore'
import app from '@/utils/firebase/firebaseConfig'
import { useAuthContext } from '@/utils/auth/auth-provider'

import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { getTimes } from '@/helpers/getTimes'
import BookingForm from '@/components/sectors/BookingForm/BookingForm'
import { getFirestore as getFirestoreAdmin } from 'firebase-admin/firestore'
import { useRouter } from 'next/router'
import { fetchData } from '@/helpers/getDisabledDates'
import { useForm } from 'react-hook-form'
import { adminSDK, initializeAdmin } from '@/pages/api/adminConfig'
import { stringify } from 'querystring'

function New({ booking, unavailableDates }: any) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)
  const [availableTimes, setAvailableTimes] = useState<any>([])
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const router = useRouter()

  const bookingFormRef = useRef<any>()
  const { user } = useAuthContext()
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
    if (!isDayTrip) {
      const times: any = getTimes(selectedDate)

      setAvailableTimes(times)
    }
  }, [isDayTrip, selectedDate])

  //Todo: Add function to utils to perform save items
  const handleSaveLater = async () => {
    if (!user) {
      return router.replace(
        '/authenticate?callbackUrl=/booking/new?tour=' + url
      )
    }

    const db = getFirestore(app)

    await addDoc(collection(db, 'savedBooking'), {
      ...booking,
      uid: user?.uid,
    })

    setIsSuccess(true)
    router.push('#success')
  }

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
      date:
        selectedDateTime?.toLocaleString('en-US', { hour12: true }) ||
        selectedDate?.toLocaleString('en-US'),
    }

    const db = getFirestore(app)

    const isInvalid = !formData.booker || !formData.guestNumber
    if (!selectedDate) return alert('Please select a date')
    if (isInvalid) return alert('Please fill in all fields')

    if (
      unavailableDates?.filter(
        (date: any) => date === selectedDate?.toLocaleString()
      ).length <= 2
    ) {
      await addDoc(collection(db, 'unavailableDates'), {
        uid: user?.uid,
        date: selectedDate?.toLocaleString('en-US'),
      })
    }

    if (isBookNow && formData.guestNumber > 1) {
      const queryString = stringify(bookingData)
      router.push('/booking/new/payment?' + queryString)
    }

    if (formData.guestNumber && !isBookNow) {
      await addDoc(collection(db, 'bookings'), bookingData)

      return router.replace(
        '/user/profile/' +
          user.displayName?.split(' ').join('-').toLocaleLowerCase()
      )
    }

    return
  }

  const handleAvailability = (date: Date) => {
    setSelectedDate(date)
  }

  const nextDay = new Date(currentDay)

  return (
    <>
      {isSuccess && (
        <>
          <span id='success'></span>
          <div
            className={styles.successContainer}
            onBlur={() => setIsSuccess(false)}
          >
            <p className={styles.successText}>
              Your booking has been saved on your profile
            </p>

            <div className={styles.buttonContainer}>
              <Button
                variant='primary'
                text={
                  type === 'tour' ? 'Find more tours' : 'Find more services'
                }
                onClick={() =>
                  router.push('/' + type === 'tour' ? 'tours' : 'services')
                }
              />
              <Button
                variant='secondary'
                text={'All saved items'}
                onClick={() => router.push('/user/profile/' + user?.uid)}
              />
            </div>
          </div>
        </>
      )}
      <div onClick={() => setIsSuccess(false)} className={styles.container}>
        <div>
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
                    (d: any) => d === date.toLocaleString('en-US')
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
                  <select
                    defaultValue='empty'
                    className={styles.times}
                    onChange={(time) => {
                      const [hours, minutes] =
                        time.currentTarget.value.split(':')
                      const date = new Date(
                        selectedDate.getTime() +
                          (+hours * 3600000 + +minutes.split(' ')[0] * 60000)
                      )
                      setSelectedDateTime(date)
                    }}
                  >
                    <option value='empty' disabled>
                      Select starting time
                    </option>
                    {availableTimes?.map((time: string, index: number) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                ) : null}
              </>
            </div>
            <BookingForm
              // @ts-ignore
              ref={bookingFormRef}
              booker={user?.displayName ?? ''}
              onSubmit={handleBookNow}
              onBack={function (): void {
                throw new Error('Function not implemented.')
              }}
              onContinue={function (): void {
                throw new Error('Function not implemented.')
              }}
              guestNumber={0}
              isValid={false}
              isPrivate={isPrivate}
            />
          </div>

          <div className={styles.bookingOptions}>
            <div className={styles.bookOption}>
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
            </div>
            <div className={styles.bookOption}>
              <div>
                Reserve your spot on <b>{title}</b> for {currency}
                {price}/person (group tour).
                <br />
                <p>
                  Individual bookings available with no minimum requirement.
                </p>
                <p>
                  Please note: Price may decrease if more participants join.
                  Online payment is not available for this option.
                </p>
              </div>
              <Button
                variant='primary'
                onClick={() => {
                  setIsPrivate(false)
                  handleBookNow(false)
                }}
              >
                Reserve Now
              </Button>
            </div>

            <div className={styles.bookOption}>
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
            </div>
          </div>
          <div>
            <br />
            <br />
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
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
