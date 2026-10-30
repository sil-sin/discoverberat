'use client';

import Button from '@/components/simple/Button';
import React, { useRef, useState } from 'react';
import styles from './new.module.css';
import { useAuthContext } from '@/utils/auth/auth-provider';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  MAX_GUESTS_PER_SLOT,
  MIN_GUESTS,
  getStartTimes,
  toDateKey,
} from '@/helpers/booking';
import BookingForm from '@/components/sectors/BookingForm/BookingForm';
import { useRouter } from 'next/navigation';
import useSaveLater from '@/hooks/useSaveLater';
import { toast } from '@/components/simple/Toast';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheck } from 'react-icons/fi';

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

type BookingClientProps = {
  booking: any;
  blockedDates: string[];
  seatsLeft: Record<string, number>;
  createBooking: (
    idToken: string,
    dateKey: string,
    booking: Record<string, any>,
  ) => Promise<{ bookingId?: string; error?: string }>;
};

export function BookingClient({
  booking,
  blockedDates,
  seatsLeft,
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
  const startTimes = getStartTimes(booking);

  const seatsAt = (date: Date, time?: string) =>
    seatsLeft[`${toDateKey(date)} ${time}`];
  const isFull = (date: Date, time?: string) =>
    (seatsAt(date, time) ?? MAX_GUESTS_PER_SLOT) < MIN_GUESTS;
  const isUnavailable = (date: Date) =>
    blockedDates.includes(toDateKey(date)) ||
    startTimes.every((time) => isFull(date, time));
  const firstFreeTime = (date: Date) =>
    startTimes.find((time) => !isFull(date, time)) ?? startTimes[0];

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const day = getTomorrow();
    for (let i = 0; i < 365 && isUnavailable(day); i++) {
      day.setDate(day.getDate() + 1);
    }
    return day;
  });
  const [selectedTime, setSelectedTime] = useState(() =>
    firstFreeTime(selectedDate),
  );
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState(false);
  const [guests, setGuests] = useState(2);
  const router = useRouter();

  const bookingFormRef = useRef<any>(null);
  const { user, openAuth } = useAuthContext();

  const { handleSaveLater, isSaving } = useSaveLater(booking);
  const currentDay = new Date().setDate(new Date().getDate() + 1);

  const availableTimes = isDayTrip && !tourTime ? [] : startTimes;

  const handleBookNow = async (isBookNow: boolean) => {
    if (!user) return openAuth('book');

    setIsBooking(true);
    const error = await (async () => {
      const formData = await bookingFormRef.current.getFormData();
      const isInvalid = !(await bookingFormRef.current.validate());
      if (!selectedDate) return 'Select a date for your tour.';
      if (isInvalid) return 'Check the highlighted booking fields.';
      if (isBookNow) return null;

      const result = await createBooking(
        await user.getIdToken(),
        toDateKey(selectedDate),
        { bookingId: id, ...formData, time: selectedTime },
      );
      if (result.error) return result.error;
      router.push('new/thank-you?id=' + result.bookingId);
    })().catch(() => {
      toast.banner('error', 'Your booking could not be saved. Please try again.');
      return null;
    });

    if (error !== undefined) setIsBooking(false);
    if (error) toast.error(error);
  };

  const handleAvailability = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(firstFreeTime(date));
  };

  const nextDay = new Date(currentDay);

  const imageUrl = booking.image?.fields?.file?.url;
  const total = price * guests;
  const formattedDate = selectedDate.toLocaleDateString('en-GB', {
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
                tileDisabled={({ date }) => isUnavailable(date)}
                tileClassName={({ date }) =>
                  isUnavailable(date) ? styles.fullyBooked : null
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
                        isDisabled={isFull(selectedDate, time)}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                        {seatsAt(selectedDate, time) !== undefined && (
                          <span className={styles.seatsLeft}>
                            {isFull(selectedDate, time)
                              ? 'Full'
                              : `${seatsAt(selectedDate, time)} left`}
                          </span>
                        )}
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
              maxGuests={seatsAt(selectedDate, selectedTime) ?? MAX_GUESTS_PER_SLOT}
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
            isDisabled={isFull(selectedDate, selectedTime)}
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
            isLoading={isSaving}
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
