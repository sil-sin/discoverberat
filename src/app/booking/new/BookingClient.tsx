'use client';

import { Button } from '@/components/ui/Button';
import { MobileBar } from '@/components/ui/MobileBar';
import React, { useRef, useState } from 'react';
import styles from './new.module.css';
import { useAuthContext } from '@/lib/auth/auth-provider';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  MAX_GUESTS_PER_SLOT,
  MIN_GUESTS,
  getStartTimes,
  toDateKey,
} from '@/lib/booking';
import { BookingForm } from '@/app/booking/new/_components/BookingForm';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/Toast';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheck } from 'react-icons/fi';
import { sendEmailVerification } from 'firebase/auth';

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

      // Email sign-ups verify before booking; reload picks up a link opened since sign-in.
      const wasVerified = user.emailVerified;
      if (!wasVerified) await user.reload();
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        toast.banner(
          'info',
          `Verify your email to book. We sent a link to ${user.email}. Open it, then press Reserve again.`,
        );
        return null;
      }

      const result = await createBooking(
        await user.getIdToken(!wasVerified),
        toDateKey(selectedDate),
        { bookingId: id, ...formData, guestNumber: guestCount, time: selectedTime },
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

  const maxGuests = seatsAt(selectedDate, selectedTime) ?? MAX_GUESTS_PER_SLOT;
  const guestCount = Math.max(MIN_GUESTS, Math.min(guests, maxGuests));
  const reserve = () => {
    setIsPrivate(false);
    handleBookNow(false);
  };
  const imageUrl = booking.image?.fields?.file?.url;
  const total = price * guestCount;
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
                prev2Label={null}
                next2Label={null}
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
            <div>
              <p id="guests-label" className={styles.timesLabel}>
                Guests
              </p>
              <div className={styles.stepper} role="group" aria-labelledby="guests-label">
                <Button
                  className={styles.timeButton}
                  variant="tertiary"
                  buttonName="Fewer guests"
                  isDisabled={guestCount <= MIN_GUESTS}
                  onClick={() => setGuests(guestCount - 1)}
                >
                  −
                </Button>
                <output aria-live="polite">{guestCount}</output>
                <Button
                  className={styles.timeButton}
                  variant="tertiary"
                  buttonName="More guests"
                  isDisabled={guestCount >= maxGuests}
                  onClick={() => setGuests(guestCount + 1)}
                >
                  +
                </Button>
              </div>
            </div>
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
                {guestCount} × {currency}
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
            onClick={reserve}
          >
            Reserve now
          </Button>
          <p className={styles.terms}>
            By booking, you accept our{' '}
            <Link href="/terms">Terms and Conditions</Link>.
          </p>
        </aside>
      </div>
      <MobileBar
        label={
          <>
            Total{' '}
            <strong>
              {currency}
              {total}
            </strong>
          </>
        }
      >
        <Button
          isDisabled={isFull(selectedDate, selectedTime)}
          isLoading={isBooking}
          variant="primary"
          onClick={reserve}
        >
          Reserve now
        </Button>
      </MobileBar>
    </div>
  );
}
