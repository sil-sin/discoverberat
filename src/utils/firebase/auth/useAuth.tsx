import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import {
  User,
  getAuth,
  onIdTokenChanged,
} from 'firebase/auth'
import app from '../firebaseConfig'
import nookies from 'nookies'

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

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        const token = await user.getIdToken()
        nookies.set(undefined, 'token', token, { path: '/' })
      } else {
        setUser(null)
        nookies.set(undefined, 'token', '', { path: '/' })
      }
    })

    return unsubscribe
  }, [auth])

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
