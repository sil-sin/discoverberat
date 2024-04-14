import React from 'react'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard({ bookings, user }: any) {
  if (!user) {
    return null
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
                <td>{user.displayName}</td>
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
          <h3>All bookings</h3>
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
                <span> {booking.title}</span> | <span>{booking.date}</span> |{' '}
                <span>{booking.isPaid ? 'Paid' : 'Not paid'}</span>
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
                      <th>Booker email</th>
                      <td>{booking.email}</td>
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
      </main>
    </div>
  )
}
