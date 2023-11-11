import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import { User, onAuthStateChanged, getAuth } from 'firebase/auth'
import app from '../firebaseConfig'

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
  const [loading, setLoading] = useState(true) // Initialize with loading state
  const auth = getAuth(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [auth])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
