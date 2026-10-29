// One-off: count future bookings made before bookingSlots existed toward their slot's 20-guest limit.
// Dry run:  node --env-file=.env.production scripts/backfill-booking-slots.mjs
// Write:    node --env-file=.env.production scripts/backfill-booking-slots.mjs --apply
// Safe to re-run: a booking that already has a slotId is skipped.
import { cert, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

const apply = process.argv.includes('--apply')
initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
})
const db = getFirestore()

const inTirane = (date, options) => date.toLocaleString('en-GB', { timeZone: 'Europe/Tirane', ...options })

const legacy = (await db.collection('bookings').where('date', '>=', new Date()).get()).docs.filter(
  (doc) => !doc.data().slotId,
)
console.log(`${legacy.length} future bookings without a slot (${apply ? 'writing' : 'dry run'})`)

for (const doc of legacy) {
  const booking = doc.data()
  const date = booking.date.toDate()
  const time = inTirane(date, { hour: '2-digit', minute: '2-digit' })
  const dateKey = booking.dateKey ?? `${inTirane(date, { day: '2-digit', month: '2-digit', year: 'numeric' })}, 00:00:00`
  const slotId = encodeURIComponent(`${booking.bookingId}_${dateKey}_${time}`)
  console.log(`${doc.id}  ${booking.title}  ${dateKey.slice(0, 10)} ${time}  +${booking.guestNumber} guests`)
  if (!apply) continue

  await db.runTransaction(async (tx) => {
    const fresh = await tx.get(doc.ref)
    if (!fresh.exists || fresh.data().slotId) return
    const oldLock = booking.dateKey && booking.uid
      ? (
          await tx.get(
            db
              .collection('unavailableDates')
              .where('uid', '==', booking.uid)
              .where('date', '==', booking.dateKey)
              .limit(1),
          )
        ).docs[0]
      : undefined
    tx.set(
      db.collection('bookingSlots').doc(slotId),
      { tourId: booking.bookingId, dateKey, time, day: date, guests: FieldValue.increment(booking.guestNumber) },
      { merge: true },
    )
    tx.update(doc.ref, { slotId, dateKey })
    if (oldLock) tx.delete(oldLock.ref)
  })
}
