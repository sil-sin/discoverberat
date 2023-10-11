import { Session } from 'inspector'
import { GetSessionParams, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

export function Auth({
  children,
  session,
}: {
  children: ReactNode
  session: Session | null
}) {
  const router = useRouter()

  if (!session) {
    // Redirect to the login page if the user is not authenticated
    router.push('/login')
    return null
  }

  return children
}
export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const session = await getSession(context)

  return {
    props: {
      session,
    },
  }
}
