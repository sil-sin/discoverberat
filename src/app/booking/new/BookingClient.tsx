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
import Image from 'next/image';
import Link from 'next/link';
import { FiCheck } from 'react-icons/fi';

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
  const [guests, setGuests] = useState(2);
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

  const imageUrl = booking.image?.fields?.file?.url;
  const total = price * guests;
  const formattedDate = selectedDateTime?.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className={styles.page}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <Link href="/tours">Tours</Link>
        <span aria-hidden>/</span>
        <Link href={`/tours/${url}`}>{title}</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">Book</span>
      </nav>
      <h1 className={styles.title}>Book {title}</h1>

      <div className={styles.layout}>
        <div className={styles.steps}>
          <section className={styles.step} aria-labelledby="step-date">
            <h2 id="step-date" className={styles.stepTitle}>
              <span aria-hidden>1</span> Date and time
            </h2>
            <div className={styles.calendar}>
              <ReactCalendar
                tileDisabled={({ date }) =>
                  unavailableDates.includes(date.toLocaleString('en-GB'))
                }
                tileClassName={({ date }) =>
                  unavailableDates.includes(date.toLocaleString('en-GB'))
                    ? styles.fullyBooked
                    : null
                }
                value={selectedDate}
                minDate={nextDay}
                onClickDay={handleAvailability}
              />
            </div>
            {availableTimes?.length === 1 ? (
              <p className={styles.fixedTime}>
                Starts at <strong>{availableTimes[0]}</strong>
              </p>
            ) : availableTimes?.length ? (
              <div>
                <p id="start-time-label" className={styles.timesLabel}>
                  Choose a start time
                </p>
                <ul className={styles.times} aria-labelledby="start-time-label">
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
          </section>

          <section className={styles.step} aria-labelledby="step-details">
            <h2 id="step-details" className={styles.stepTitle}>
              <span aria-hidden>2</span> Your details
            </h2>
            <BookingForm
              // @ts-ignore
              ref={bookingFormRef}
              booker={user?.displayName ?? ''}
              onSubmit={handleBookNow}
              onGuestsChange={setGuests}
              guestNumber={0}
              isValid={false}
              isPrivate={isPrivate}
              email={user?.email ?? ''}
            />
          </section>
        </div>

        <aside className={styles.summary} aria-label="Booking summary">
          {imageUrl && (
            <Image
              className={styles.summaryImage}
              src={`https:${imageUrl}`}
              alt=""
              width={340}
              height={190}
            />
          )}
          <h2 className={styles.summaryTitle}>{title}</h2>
          <dl className={styles.summaryList}>
            <div>
              <dt>Date</dt>
              <dd>{formattedDate}</dd>
            </div>
            <div>
              <dt>Start time</dt>
              <dd>{selectedTime}</dd>
            </div>
            <div>
              <dt>Guests</dt>
              <dd>
                {guests} × {currency}
                {price}
              </dd>
            </div>
            <div className={styles.total}>
              <dt>Total</dt>
              <dd>
                {currency}
                {total}
              </dd>
            </div>
          </dl>
          <ul className={styles.facts}>
            <li>
              <FiCheck aria-hidden /> Pay online with PayPal after you reserve,
              or pay on the day
            </li>
            <li>
              <FiCheck aria-hidden />
              <span>
                Free cancellation up to 24 hours before.{' '}
                <Link href="/refund-policy">Refund policy</Link>
              </span>
            </li>
          </ul>
          <Button
            className={styles.summaryButton}
            isDisabled={!selectedDateTime && !isDayTrip}
            isLoading={isBooking}
            variant="primary"
            onClick={() => {
              setIsPrivate(false);
              handleBookNow(false);
            }}
          >
            Reserve now
          </Button>
          <Button
            className={styles.summaryButton}
            onClick={handleSaveLater}
            variant="secondary"
          >
            Save for later
          </Button>
          <p className={styles.terms}>
            By booking, you accept our{' '}
            <Link href="/terms">Terms and Conditions</Link>.
          </p>
        </aside>
      </div>
    </div>
  );
}
