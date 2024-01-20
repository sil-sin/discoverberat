import React from 'react'
import styles from './Dashboard.module.css'
export default function Dashboard({ bookings, savedItems }: any) {
  if (!bookings) {
    return null
  }

  console.log(bookings)

  return (
    <div className={styles.body}>
      <main className={styles.dataPage}>
        <section className={styles.contactDetailsTable}>
          <h2>User details</h2>
          {/* <table className={styles.contactDetailsDesktop}>
            <tr>
              <th>Full name</th>
              <th>Phone</th>
              <th>E-mail</th>
            </tr>
            <tr>
              <td>Mauricio Fastichelli</td>
              <td>+380935513047</td>
              <td className={styles.contactDetailsEmail}>
                somelonglong-veryverylong-email@gmail.com
              </td>
            </tr>
          </table> */}
          {/* <table className={styles.contactDetailsMobile}>
            <tr>
              <th>Full name</th>
              <td>Mauricio Fastichelli</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>+380935513047</td>
            </tr>
            <tr>
              <th>E-mail</th>
              <td className={styles.contactDetailsEmail}>
                somelonglong-veryverylong-email@gmail.com
              </td>
            </tr>
          </table> */}
        </section>
        <section className={styles.bookingTable}>
          <h2>Bookings</h2>
          {bookings?.map((booking: any, index: any) => (
            <div key={booking.id} className={styles.tableSegment}>
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
        <section className={styles.bookingTable}>
          <h2>Saved items</h2>
          <div className={styles.tableSegment}>
            <input
              type='checkbox'
              id='segment-3'
              name='segment-checker'
              value=''
            />
            <label htmlFor='segment-3' className={styles.tableSegmentTitle}>
              Berlin Central Station &mdash; Madrid Puerta de Atocha
            </label>
            <div className={styles.tableWrapper}>
              {/* <table>
                <tr>
                  <th>Train / Bus / Flight</th>
                  <td>LO0024 (LOT - Polish Airlines)</td>
                </tr>
                <tr>
                  <th>Departure</th>
                  <td>21:40, 18.09.2017</td>
                </tr>
                <tr>
                  <th>Arrival</th>
                  <td>18:00, 19.09.2017</td>
                </tr>
                <tr>
                  <th>Tariff</th>
                  <td>Economy</td>
                </tr>
                <tr>
                  <th>Carriers reference number</th>
                  <td>KD95RR</td>
                </tr>
                <tr>
                  <th>Ticket type</th>
                  <td>ETK</td>
                </tr>
              </table> */}
            </div>
          </div>
        </section>

        <section className={styles.priceTable}>
          <h2>Price</h2>
          {/* <table>
            <tr>
              <th>Fare</th>
              <th>Fees</th>
              <th>Agent service fee</th>
              <th>Total</th>
            </tr>
            <tr>
              <td>2 964.98 UAH</td>
              <td>1 296.50 UAH</td>
              <td>1 190.00 UAH</td>
              <td>105 630.74 UAH</td>
            </tr>
          </table> */}
        </section>
      </main>
    </div>
  )
}
