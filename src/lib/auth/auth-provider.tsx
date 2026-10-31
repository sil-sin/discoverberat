'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { User, getAuth, onIdTokenChanged } from 'firebase/auth';
import app from '@/lib/firebase/client';
import { setSessionToken } from './session';
import { clearSession } from './sign-out';
import { waitForProfile } from './email-sign-up';

export type AuthReason = 'signIn' | 'save' | 'book';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  authReason: AuthReason | null;
  openAuth: (reason?: AuthReason) => void;
  closeAuth: () => void;
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
  const [authReason, setAuthReason] = useState<AuthReason | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    if (!auth) return;

    // Queued so a slow earlier call can't overwrite the cookie set by a later event, such as a sign-out.
    let queue = Promise.resolve();
    let uid: string | undefined;
    return onIdTokenChanged(auth, (user) => {
      const shouldSync = Boolean(user || uid);
      if (user?.uid !== uid) setLoading(true);
      uid = user?.uid;
      queue = queue.then(async () => {
        try {
          if (shouldSync) await (user ? setSessionToken(await user.getIdToken()) : clearSession());
        } catch (error) {
          console.error('Session cookie update failed:', error);
        }
        await waitForProfile();
        setUser(user);
        setLoading(false);
        if (user) setAuthReason(null);
      });
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authReason,
        openAuth: (reason = 'signIn') => setAuthReason(reason),
        closeAuth: () => setAuthReason(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
