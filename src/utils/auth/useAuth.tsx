import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import { User, getAuth, onIdTokenChanged } from 'firebase/auth'
import app from '../firebase/firebaseConfig'
import nookies from 'nookies'
import { useRouter } from 'next/router'

type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const auth = getAuth(app)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        const token = await user.getIdToken()
        nookies.set(undefined, 'token', token, { path: '/' })
        setLoading(false)
      } else {
        setUser(null)
        nookies.set(undefined, 'token', '', { path: '/' })
        setLoading(false)
      }
    })

    return unsubscribe
  }, [auth, router])

  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser
      if (user) await user.getIdToken(true)
    }, 10 * 60 * 1000)

    return () => clearInterval(handle)
  }, [auth.currentUser])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
