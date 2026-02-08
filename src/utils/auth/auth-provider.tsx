'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../firebase/firebaseConfig';
import nookies from 'nookies';
import { googleProvider } from './googleProvider';
import { signOutUser } from './signOut';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  // isAdmin: boolean
  loginWithGoogle: () => void;
  logout: () => void;
  // login: (email: string, password: string) => Promise<void>
  // signUp: (email: string, password: string) => Promise<void>
  // resetPassword: (email: string) => Promise<void>
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    const auth = getAuth(app);
    if (!auth) return;

    return auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdToken();
        nookies.set(null, 'token', token, { path: '/' });

        // TODO: later implementation, edit mode on page , if user is admin
        // if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        // setIsAdmin(true)
        // }
      } else {
        setUser(null);
        nookies.set(null, 'token', '', { path: '/' });
        // setIsAdmin(false)
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        // isAdmin,
        loginWithGoogle: googleProvider,
        logout: signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
