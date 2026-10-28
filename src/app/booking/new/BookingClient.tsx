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

const getStartDate = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  startDate.setHours(9, 0, 0, 0);
  return startDate;
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
  const [selectedDate, setSelectedDate] = useState<Date>(getStartDate);
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

  const {
    id,
    title,
    price,
    currency = '€',
    description,
    url,
    isDayTrip,
  } = booking;

  const availableTimes = useMemo(
    () => (!isDayTrip ? getTimes(selectedDate) : []),
    [isDayTrip, selectedDate],
  );

  const handleBookNow = async (isBookNow: boolean) => {
    if (!user) {
      return router.replace(
        '/authenticate?callbackUrl=/booking/new?tour=' + url,
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
    })().catch(() => 'Your booking could not be saved. Please try again.');

    if (error !== undefined) setIsBooking(false);
    if (error) toast.error(error);
  };

  const handleAvailability = (date: Date) => {
    setSelectedDate(date);
    const defaultTime = new Date(date);
    defaultTime.setHours(9, 0, 0);
    setSelectedDateTime(defaultTime);
  };

  const nextDay = new Date(currentDay);

  const handleTimeSelection = (selectedTime: string) => {
    const [hours, minutes] = selectedTime.split(':');
    const newDateTime = selectedDate && new Date(selectedDate.getTime());

    if (newDateTime) {
      newDateTime.setHours(+hours);
      newDateTime.setMinutes(+minutes);
    }

    setSelectedDateTime(newDateTime);
  };

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
                            variant="tertiary"
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
