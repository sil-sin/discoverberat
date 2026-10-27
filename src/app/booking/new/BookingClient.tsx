'use client';

import Button from '@/components/simple/Button';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './new.module.css';
import { useAuthContext } from '@/utils/auth/auth-provider';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getTimes } from '@/helpers/getTimes';
import BookingForm from '@/components/sectors/BookingForm/BookingForm';
import { useRouter } from 'next/navigation';
import useSaveLater from '@/hooks/useSaveLater';
import Modal from '@/components/Modal';
import Toast from '@/components/simple/Toast';

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
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);
  const router = useRouter();

  const bookingFormRef = useRef<any>(null);
  const { user } = useAuthContext();

  const { handleSaveLater, isSuccess, isTouched } = useSaveLater(
    { ...booking },
    booking.url,
  );
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

  // Sync modal open state from isSuccess without useEffect
  const [prevIsSuccess, setPrevIsSuccess] = useState(isSuccess);
  if (prevIsSuccess !== isSuccess) {
    setPrevIsSuccess(isSuccess);
    setIsShowModal(isSuccess);
  }

  const availableTimes = useMemo(
    () => (!isDayTrip ? getTimes(selectedDate) : []),
    [isDayTrip, selectedDate],
  );

  const [prevIsTouched, setPrevIsTouched] = useState(isTouched);
  if (prevIsTouched !== isTouched) {
    setPrevIsTouched(isTouched);
    setWarning(isTouched);
  }

  useEffect(() => {
    if (!warning) return;
    const timer = setTimeout(() => setWarning(false), 5000);
    return () => clearTimeout(timer);
  }, [warning]);

  const handleBookNow = async (isBookNow: boolean) => {
    if (!user) {
      return router.replace(
        '/authenticate?callbackUrl=/booking/new?tour=' + url,
      );
    }

    const formData = await bookingFormRef.current.getFormData();

    const bookingData = {
      bookingId: id,
      ...formData,
      date: selectedDateTime,
    };

    const isInvalid = !(await bookingFormRef.current.validate());
    if (!selectedDate) return alert('Please select a date');
    if (isInvalid) return alert('Please fill in all fields');
    if (isBookNow) return;

    const day = new Date(selectedDate);
    day.setHours(0, 0, 0, 0);
    const bookingId = await createBooking(
      await user.getIdToken(),
      day.toLocaleString('en-GB'),
      bookingData,
    );
    if (!bookingId) return alert('This date is fully booked. Please pick another date.');

    router.push('new/thank-you?id=' + bookingId);
  };

  const handleAvailability = (date: Date) => {
    setSelectedDate(date);
    const defaultTime = new Date(date);
    defaultTime.setHours(9, 0, 0);
    setSelectedDateTime(defaultTime);
  };

  const nextDay = new Date(currentDay);
  const handleModalClose = () => {
    setIsShowModal(false);
  };

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
      {isShowModal && (
        <Modal
          modalCta={[
            { ctaText: 'Home', ctaUrl: '/' },
            { ctaText: 'Saved tours', ctaUrl: '/user/profile/' + user?.uid },
          ]}
          id="success"
          onClose={handleModalClose}
          withCTA={true}
          modalTitle={'Success'}
          modalDescription={`This tour has been saved on your profile. <br> Click on <em>"Saved tours"</em> to view all your saved items, or <em>"Home"</em> to go back to the home page.`}
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

            {/* TODO: add "By booking you agree to the Terms" with a link to /terms */}
            <Button
              isDisabled={!selectedDateTime && !isDayTrip}
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
            {!isSuccess && warning && (
              <Toast
                withCLoseButton={false}
                onClose={() => setWarning(false)}
                message="Already saved in your profile"
                isInfo
              />
            )}
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
