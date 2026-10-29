'use client';

import Button from '@/components/simple/Button';
import React, { useMemo, useRef, useState } from 'react';
import styles from './new.module.css';
import { useAuthContext } from '@/utils/auth/auth-provider';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getTimes } from '@/helpers/getTimes';
import BookingForm from '@/components/sectors/BookingForm/BookingForm';
import { useRouter } from 'next/navigation';
import useSaveLater from '@/hooks/useSaveLater';
import { toast } from '@/components/simple/Toast';

const withTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':');
  const dateTime = new Date(date);
  dateTime.setHours(+hours, +minutes, 0, 0);
  return dateTime;
};

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

type BookingClientProps = {
  booking: any;
  unavailableDates: string[];
  createBooking: (
    idToken: string,
    dateKey: string,
    booking: Record<string, any>,
  ) => Promise<string | null>;
};

export function BookingClient({
  booking,
  unavailableDates,
  createBooking,
}: BookingClientProps) {
  const {
    id,
    title,
    price,
    currency = '€',
    description,
    url,
    isDayTrip,
    tourTime,
  } = booking;
  const defaultTime: string = tourTime?.[0] ?? '09:00';

  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    withTime(getTomorrow(), defaultTime),
  );
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(
    selectedDate,
  );
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState(false);
  const router = useRouter();

  const bookingFormRef = useRef<any>(null);
  const { user } = useAuthContext();

  const { handleSaveLater } = useSaveLater(booking);
  const currentDay = new Date().setDate(new Date().getDate() + 1);

  const availableTimes = useMemo(
    () => tourTime ?? (!isDayTrip ? getTimes(selectedDate) : []),
    [tourTime, isDayTrip, selectedDate],
  );

  const handleBookNow = async (isBookNow: boolean) => {
    if (!user) {
      return router.push(
        '/authenticate?reason=book&callbackUrl=' +
          encodeURIComponent('/booking/new?tour=' + url),
      );
    }

    setIsBooking(true);
    const error = await (async () => {
      const formData = await bookingFormRef.current.getFormData();
      const isInvalid = !(await bookingFormRef.current.validate());
      if (!selectedDate) return 'Select a date for your tour.';
      if (isInvalid) return 'Check the highlighted booking fields.';
      if (isBookNow) return null;

      const day = new Date(selectedDate);
      day.setHours(0, 0, 0, 0);
      const bookingId = await createBooking(
        await user.getIdToken(),
        day.toLocaleString('en-GB'),
        { bookingId: id, ...formData, date: selectedDateTime },
      );
      if (!bookingId) return 'This date is fully booked. Pick another date.';
      router.push('new/thank-you?id=' + bookingId);
    })().catch(() => {
      toast.banner('error', 'Your booking could not be saved. Please try again.');
      return null;
    });

    if (error !== undefined) setIsBooking(false);
    if (error) toast.error(error);
  };

  const handleAvailability = (date: Date) => {
    setSelectedDate(date);
    setSelectedDateTime(withTime(date, defaultTime));
  };

  const nextDay = new Date(currentDay);

  const handleTimeSelection = (selectedTime: string) =>
    setSelectedDateTime(withTime(selectedDate, selectedTime));

  const selectedTime = selectedDateTime?.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div>
      <div>
        <div className={styles.container}>
          <h2> {title} </h2>
          <div>
            <div>
              {description?.split('.')[0]}.
              <Button
                className={styles.link}
                variant="link"
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
                  return (
                    unavailableDates.filter(
                      (d: any) => d === date.toLocaleString('en-GB'),
                    ).length > 0
                  );
                }}
                value={selectedDate}
                minDate={nextDay}
                onClickDay={handleAvailability}
              />
              <>
                {availableTimes?.length === 1 ? (
                  <div className={styles.timesContainer}>
                    <p>
                      Starting time: <strong>{availableTimes[0]}</strong>
                    </p>
                  </div>
                ) : availableTimes?.length ? (
                  <div className={styles.timesContainer}>
                    <p id="start-time-label">Select starting time</p>
                    <ul
                      className={styles.times}
                      aria-labelledby="start-time-label"
                    >
                      {availableTimes.map((time: string) => (
                        <li key={time}>
                          <Button
                            className={styles.timeButton}
                            variant="tertiary"
                            isPressed={time === selectedTime}
                            onClick={() => handleTimeSelection(time)}
                          >
                            {time}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
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

          <div className={styles.bookOption}>
            <div>
              <h2>Reserve now, pay online or on the day.</h2>
              <hr />
              <h3>
                {currency}
                {price}/PERSON
              </h3>
              <p>Minimum booking requirement: 2 persons.</p>
              <p>
                After you reserve, you can pay online with PayPal, or pay on
                the day of the tour.
              </p>
            </div>

            <p>
              By booking, you accept our{' '}
              <Button variant="link" href="/terms">
                Terms and Conditions
              </Button>
              .
            </p>
            <Button
              isDisabled={!selectedDateTime && !isDayTrip}
              isLoading={isBooking}
              variant="primary"
              onClick={() => {
                setIsPrivate(false);
                handleBookNow(false);
              }}
            >
              Reserve Now
            </Button>
            <Button onClick={handleSaveLater} variant="secondary">
              Save for later
            </Button>
          </div>

          <div>
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
