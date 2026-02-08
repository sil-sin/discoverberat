'use client';

import Button from '@/components/simple/Button';
import React, { useEffect, useRef, useState } from 'react';
import styles from './new.module.css';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import app from '@/utils/firebase/firebaseConfig';
import { useAuthContext } from '@/utils/auth/auth-provider';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getTimes } from '@/helpers/getTimes';
import BookingForm from '@/components/sectors/BookingForm/BookingForm';
import { useRouter } from 'next/navigation';
import useSaveLater from '@/hooks/useSaveLater';
import Modal from '@/components/Modal';
import Toast from '@/components/simple/Toast';

const startDay = new Date().setDate(new Date().getDate() + 1);
const startDateObject = new Date(startDay);
startDateObject.setHours(9);
startDateObject.setMinutes(0);

type BookingClientProps = {
  booking: any;
  unavailableDates: string[];
};

export function BookingClient({
  booking,
  unavailableDates,
}: BookingClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(startDateObject);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(
    startDateObject,
  );
  const [availableTimes, setAvailableTimes] = useState<any>([]);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);
  const router = useRouter();

  const bookingFormRef = useRef<any>(null);
  const { user } = useAuthContext();

  const tourUrl = '/authenticate?callbackUrl=/booking/new?tour=' + booking.url;

  const { handleSaveLater, isSuccess, isTouched } = useSaveLater(
    { ...booking },
    tourUrl,
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
    type,
  } = booking;

  useEffect(() => {
    if (isSuccess) {
      setIsShowModal(isSuccess);
    } else {
      setIsShowModal(false);
      setWarning(isTouched);
    }
  }, [isSuccess, isTouched]);

  useEffect(() => {
    setTimeout(() => {
      setWarning(false);
    }, 5000);
  }, [warning]);

  useEffect(() => {
    if (!isDayTrip) {
      const times: any = getTimes(selectedDate);
      setAvailableTimes(times);
    }
  }, [isDayTrip, selectedDate]);

  const handleBookNow = async (isBookNow: boolean) => {
    if (!user) {
      return router.replace(
        '/authenticate?callbackUrl=/booking/new?tour=' + url,
      );
    }

    const formData = await bookingFormRef.current.getFormData();

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
    };

    const db = getFirestore(app);

    const isInvalid = !formData.booker || !formData.guestNumber;
    if (!selectedDate) return alert('Please select a date');
    if (isInvalid) return alert('Please fill in all fields');

    if (
      unavailableDates?.filter(
        (date: any) => date === selectedDate?.toLocaleString(),
      ).length <= 5
    ) {
      await addDoc(collection(db, 'unavailableDates'), {
        uid: user?.uid,
        date: selectedDate?.toLocaleString('en-GB'),
      });
    }

    const subject = `New booking from ${bookingData.booker} on ${bookingData.date}`;
    const message = `Hi,<p> I'm ${bookingData.booker} and I just reserved this tour:</p> ${title} on ${bookingData.date} for ${bookingData.guestNumber} guests. I'll be in touch with you soon.`;
    const bookingConfirmationSubject = `Booking confirmation:  ${title} on ${bookingData.date} for ${bookingData.guestNumber} guests`;
    const bookingConfirmationMessage = `Dear ${bookingData.booker}, <p>Thank you for your reservation of ${title} on ${bookingData.date} for ${bookingData.guestNumber} guests. <p>See you soon !</p>`;

    if (formData.guestNumber && !isBookNow) {
      await addDoc(collection(db, 'bookings'), bookingData).then(
        async (res) => {
          await addDoc(collection(db, 'mail'), {
            to: bookingData.email,
            message: {
              subject: bookingConfirmationSubject,
              html: bookingConfirmationMessage,
            },
          });
          await addDoc(collection(db, 'mail'), {
            to: process.env.NEXT_PUBLIC_ADMIN,
            message: {
              subject: subject,
              html: message,
            },
          });
          router.push('new/thank-you?id=' + res.id);
        },
      );
    }

    return;
  };

  const handleAvailability = (date: Date) => {
    setSelectedDate(date);
    if (isDayTrip) {
      const defaultTime = new Date(date);
      defaultTime.setHours(9, 0, 0);
      setSelectedDateTime(defaultTime);
    }
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
