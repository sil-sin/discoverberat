'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { User, getAuth, onIdTokenChanged } from 'firebase/auth';
import app from '../firebase/firebaseConfig';
import { setSessionToken } from './session';
import { googleProvider } from './googleProvider';
import { signOutUser } from './signOut';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
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

  useEffect(() => {
    const auth = getAuth(app);
    if (!auth) return;

    return onIdTokenChanged(auth, async (user) => {
      await setSessionToken(user && (await user.getIdToken()));
      setUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle: googleProvider,
        logout: signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
