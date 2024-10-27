import Image from 'next/image'
import { getBookings } from '@/actions/getBookings'
import { getSavedItems } from '@/actions/getSavedItems'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import styles from './page.module.css'
import { adminSDK } from '@/lib/adminConfig'
import Dashboard from '@/components/Dashboard/Dashboard'
import { serializeUser } from '@/utils/firebase/serializeUser'

export default async function Page({ params }: { params: any }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') || ''

  // Encode the pathname for the redirect URL
  const encodedRedirectUrl = encodeURIComponent(pathname)

  // Check if token exists
  if (!token?.value) {
    redirect(`/authenticate?callbackUrl=${encodedRedirectUrl}`)
  }

  try {
    // Verify the token and get user data
    const authenticatedUser = await adminSDK.auth().verifyIdToken(token.value)

    if (!authenticatedUser?.uid) {
      redirect(`/authenticate?callbackUrl=${encodedRedirectUrl}`)
    }

    const currentUser = await adminSDK.auth().getUser(authenticatedUser.uid)
    const isAdmin = currentUser.uid === process.env.ADMIN_ID

    // Extract userId from params
    const { userId } = await params

    // Check if user is accessing their own profile
    if (userId !== currentUser.uid) {
      redirect(`/user/profile/${currentUser.uid}`)
    }

    // Get user data
    const upcomingBookings = await getBookings(currentUser)
    const savedItems = isAdmin ? [] : await getSavedItems(currentUser.uid)

    // Serialize the user object
    const serializedUser = serializeUser(currentUser)

    return (
      <div className={styles.container}>
        <div className={styles.userContainer}>
          <div className={styles.userInfo}>
            <Image
              src={serializedUser.photoURL || '/avatar.svg'}
              alt={serializedUser.displayName ?? 'Profile Picture'}
              width={50}
              height={50}
            />
            <h2 className={styles.title}>
              {`Welcome ${serializedUser.displayName}`}
            </h2>
          </div>
          <Dashboard
            bookings={upcomingBookings}
            savedItems={savedItems}
            user={serializedUser}
          />
        </div>
      </div>
    )
  } catch (error) {
    // If there's any error with token verification, redirect to auth
    console.error('Authentication error:', error)
    redirect(`/authenticate?callbackUrl=${encodedRedirectUrl}`)
  }
}
