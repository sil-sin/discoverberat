import Button from '@/components/simple/Button'
import React, { useEffect } from 'react'
import styles from './new.module.css'

import { GetServerSidePropsContext } from 'next'
import { getEntriesByType } from '@/utils/contentful/contentful'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import app from '@/utils/firebase/firebaseConfig'
import { useAuthContext } from '@/utils/auth/auth-provider'

import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { getTimes } from '@/helpers/getTimes'
import BookingForm from '@/components/sectors/BookingForm/BookingForm'
function New({ booking }: any) {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
  const [availableTimes, setAvailableTimes] = React.useState<any>([])

  const bookingFormRef = React.useRef<any>()
  const { user } = useAuthContext()

  const currentDay = new Date().setDate(new Date().getDate() + 1)
  const allDayTour = false

  useEffect(() => {
    if (!selectedDate) return

    const times: any = getTimes()
    setAvailableTimes(times)
  }, [selectedDate])

  if (!booking || !user) return

  const { title, price, currency = '€', description, url } = booking

  //Todo: Add function to utils to perform save items
  const handleSaveLater = async () => {
    if (!user) return
    const db = getFirestore(app)

    await addDoc(collection(db, 'savedBooking'), {
      ...booking,
      uid: user?.uid,
    })

    // Todo : Add notification
    console.log('Document successfully written!')
  }

  const handleBookNow = async () => {
    const formData = await bookingFormRef.current.getFormData()

    const unavailableDates = JSON.parse(
      localStorage.getItem('unavailableDates') || '[]'
    )

    if (
      !unavailableDates?.find(
        (date: any) => date === selectedDate?.toDateString()
      )
    ) {
      console.log('here', unavailableDates, selectedDate?.toDateString())

      localStorage.setItem(
        'unavailableDates',
        JSON.stringify([...unavailableDates, selectedDate?.toDateString()])
      )
    } else {
      alert('There is no availability on this date')
    }
    console.log({ selectedDate })

    const db = getFirestore(app)
    await addDoc(collection(db, 'bookings'), {
      ...booking,
      ...formData,
      uid: user?.uid,
      date: selectedDate?.toLocaleString('en-US'),
    })
  }

  const handleAvailability = (date: Date) => {
    setSelectedDate(date)
    if (!allDayTour && selectedDate) return
    const times: any = getTimes()

    setAvailableTimes(times)
  }

  const nextDay = new Date(currentDay)

  return (
    <div>
      <div className={styles.bookingForm}>
        <BookingForm
          // @ts-ignore
          ref={bookingFormRef}
          booker={user.displayName ?? ''}
          onSubmit={handleBookNow}
          onBack={function (): void {
            throw new Error('Function not implemented.')
          }}
          onContinue={function (): void {
            throw new Error('Function not implemented.')
          }}
          guestNumber={0}
          isValid={false}
        />
      </div>
      <div>
        <h2> {title} </h2>
        <p>
          {description?.split('.')[0]}.
          <Button className={styles.link} variant='link' href={`/tours/${url}`}>
            Read more
          </Button>
          <ul>
            Included :<li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
          </ul>
        </p>
        <div className={styles.calendar}>
          <ReactCalendar
            tileDisabled={({ date }) => {
              const unavailableDates = JSON.parse(
                localStorage.getItem('unavailableDates') || '[]'
              )
              return unavailableDates.find(
                (d: any) => d === date.toDateString()
              )
            }}
            value={selectedDate}
            minDate={nextDay}
            onClickDay={handleAvailability}
          />
          {selectedDate && availableTimes && availableTimes.length && (
            <select className={styles.times}>
              <option value='' disabled selected>
                Select starting time
              </option>
              {availableTimes?.map((time: string, index: number) => (
                <>
                  <option key={index} value={time}>
                    {time}
                  </option>
                </>
              ))}
            </select>
          )}
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
            <Button variant='primary' onClick={handleBookNow}>
              Book Now
            </Button>
          </div>
          <div className={styles.bookOption}>
            <p>
              Reserve your spot on <b>{title}</b> for {currency}
              {price}/person (group tour).
              <br />
              <p>Individual bookings available with no minimum requirement.</p>
              <p>
                Please note: Price may decrease if more participants join.
                Online payment is not available for this option.
              </p>
            </p>
            <Button variant='primary' onClick={handleBookNow}>
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

  if (serviceData) {
    return {
      props: {
        booking: { ...serviceData.fields, id: serviceData.sys.id },
      },
    }
  }

  return {
    props: {
      booking: { ...tourData.fields, id: tourData.sys.id },
    },
  }
}

export default New
