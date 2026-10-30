'use client';

import ResetPassword from '@/components/Authentication/ResetPassword';
import styles from '@/components/Authentication/Auth.module.css';
import { authErrorMessage } from '@/utils/auth/errors';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import app from '@/utils/firebase/firebaseConfig';
import { useRef, useState } from 'react';

export default function ForgotPassword() {
  const emailRef = useRef('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = () => {
    const email = emailRef.current.trim();
    if (!email) return setError('Enter your email address.');
    setStatus('sending');
    setError(null);
    sendPasswordResetEmail(getAuth(app), email)
      .then(() => setStatus('sent'))
      .catch((error) => {
        // Unknown emails count as sent, so the form does not reveal who has an account.
        if (error.code === 'auth/user-not-found') return setStatus('sent');
        setStatus('idle');
        setError(authErrorMessage(error));
      });
  };

  return (
    <div className={styles.page}>
      <ResetPassword
        onChange={(e: any) => (emailRef.current = e?.target.value)}
        onSubmit={handleResetPassword}
        isSent={status === 'sent'}
        isLoading={status === 'sending'}
        error={error}
      />
    </div>
  );
}
