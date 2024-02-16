import React from 'react'
import styles from './Dashboard.module.css'
import useSaveLater from '@/hooks/useSaveLater'
import classNames from 'classnames'
import Button from '../simple/Button/index'
export default function Dashboard({ bookings, savedItems, user }: any) {
  if (!user) {
    return null
  }
  const itemLink = (item: any) => {
    return item.title.replace(/&/g, 'and').split(' ').join('-').toLowerCase()
  }

  return (
    <div className={styles.body}>
      <main className={styles.dataPage}>
        <section className={styles.contactDetailsTable}>
          <h3>User data</h3>
          <table className={''}>
            <tbody>
              <tr>
                <th>Full name</th>
                <th>E-mail</th>
              </tr>
              <tr>
                <td>{user.name}</td>
                <td className={styles.contactDetailsEmail}>{user.email}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className={styles.upcomingBooking}>
          <h3>Upcoming booking</h3>
          {bookings.length > 0 ? (
            <table className={styles.upcomingBookingTable}>
              <tbody>
                <tr>
                  <th>Booking name</th>
                  <th>Pickup</th>
                  <th>Date and Time</th>
                  <th>Payment</th>
                </tr>
                <tr>
                  <td>{bookings[0].title}</td>
                  <td>{bookings[0].pickup}</td>
                  <td>{bookings[0].date}</td>
                  <td>{bookings[0].isPaid ? 'Paid' : 'Not paid'}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No upcoming booking</p>
          )}
        </section>

        <section className={styles.bookingTable}>
          <h3>Bookings</h3>
          {bookings?.map((booking: any, index: any) => (
            <div key={index + booking.uid} className={styles.tableSegment}>
              <input
                type='checkbox'
                id={index + booking.uid}
                name='segment-checker'
                value=''
              />
              <label
                htmlFor={index + booking.uid}
                className={styles.tableSegmentTitle}
              >
                {booking.title}
              </label>
              <div className={styles.tableWrapper}>
                <table>
                  <tbody>
                    <tr>
                      <th>Time and date</th>
                      <td>{booking.date}</td>
                    </tr>
                    <tr>
                      <th>Pickup location</th>
                      <td>{booking.pickup}</td>
                    </tr>
                    <tr>
                      <th>Booker name</th>
                      <td>{booking.booker}</td>
                    </tr>
                    <tr>
                      <th>Price</th>
                      <td>
                        {booking.currency}
                        {booking.price}
                      </td>
                    </tr>
                    <tr>
                      <th>Payment</th>
                      <td>{booking.isPaid ? 'Paid' : 'Pay on location'}</td>
                    </tr>
                    <tr>
                      <th>Guest number</th>
                      <td>{booking.guestNumber} guest(s)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
        <section className={classNames(styles.bookingTable, styles.savedItems)}>
          <h3>Saved items</h3>
          {savedItems?.map((savedItem: any) => (
            <div key={savedItem.id} className={styles.tableSegment}>
              <input
                type='checkbox'
                id={savedItem.id}
                name='segment-checker'
                value=''
              />
              <label
                htmlFor={savedItem.id}
                className={styles.tableSegmentTitle}
              >
                {savedItem.title}
              </label>
              <div className={styles.tableWrapper}>
                <table>
                  <tbody>
                    <tr>
                      <th>Price</th>
                      <td>
                        {savedItem.currency}
                        {savedItem.price} / person
                      </td>
                      <td>
                        <Button
                          variant='tertiary'
                          text=' More info'
                          onClick={() =>
                            (window.location.href = `/tours/${itemLink(
                              savedItem
                            )}`)
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
