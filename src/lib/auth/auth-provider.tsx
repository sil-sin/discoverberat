'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import type { User } from 'firebase/auth';
import { setSessionToken } from './session';
import { clearSession } from './sign-out';

const AuthDialog = dynamic(() =>
  import('@/components/auth/AuthForm').then((m) => m.AuthDialog),
);

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
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    Promise.all([
      import('firebase/auth'),
      import('@/lib/firebase/client'),
      import('./email-sign-up'),
    ]).then(([{ getAuth, onIdTokenChanged }, { default: app }, { waitForProfile }]) => {
      if (cancelled) return;
      // Queued so a slow earlier call can't overwrite the cookie set by a later event, such as a sign-out.
      let queue = Promise.resolve();
      let uid: string | undefined;
      unsubscribe = onIdTokenChanged(getAuth(app), (user) => {
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
    }).catch((error) => {
      console.error('Auth failed to load:', error);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
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
      {authReason && <AuthDialog />}
    </AuthContext.Provider>
  );
}
