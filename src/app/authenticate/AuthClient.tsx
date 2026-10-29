'use client';

import { useAuthContext } from '@/utils/auth/auth-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import SignUp from '@/components/Authentication/SignUp';
import styles from './auth.module.css';
import { googleProvider } from '@/utils/auth/googleProvider';
import Button from '@/components/simple/Button';
import Image from 'next/image';
import SignIn from '@/components/Authentication/SignIn';
import classNames from 'classnames';
import { FiBookmark, FiCalendar, FiLock } from 'react-icons/fi';
import { BannerView } from '@/components/simple/Toast';

const NOTICES = {
  save: {
    Icon: FiBookmark,
    title: 'Sign in to save this tour',
    text: 'Saved tours are kept in your account. After you sign in, we take you back to the tour.',
  },
  book: {
    Icon: FiCalendar,
    title: 'Sign in to book this tour',
    text: 'Bookings are kept in your account. After you sign in, we take you back to your booking.',
  },
  default: {
    Icon: FiLock,
    title: 'Sign in to continue',
    text: 'After you sign in, we take you back to where you were.',
  },
};

export function AuthClient() {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuthContext();
  const callbackUrl = searchParams.get('callbackUrl');
  const notice =
    NOTICES[searchParams.get('reason') as keyof typeof NOTICES] ??
    NOTICES.default;

  useEffect(() => {
    if (user) {
      const profilePath = '/user/profile/' + user?.uid;
      const isLocalPath = /^\/(?![/\\])/.test(callbackUrl ?? '');
      router.push(isLocalPath ? callbackUrl! : profilePath);
    }
  }, [router, callbackUrl, user]);

  return (
    <>
      {callbackUrl && (
        <BannerView tone="info" Icon={notice.Icon} title={notice.title}>
          {notice.text}
        </BannerView>
      )}
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.tabButtons}>
            <Button
              onClick={() => setIsSignUp(true)}
              text="Sign Up"
              className={classNames(
                {
                  [styles.active]: isSignUp,
                  [styles.disabled]: loading,
                  [styles.leftTabButton]: !isSignUp,
                },
                styles.tabButton,
              )}
            />
            <Button
              onClick={() => setIsSignUp(false)}
              text="Sign In"
              className={classNames(
                {
                  [styles.active]: !isSignUp,
                  [styles.disabled]: loading,
                  [styles.rightTabButton]: isSignUp,
                },
                styles.tabButton,
              )}
            />
          </div>
          {isSignUp ? (
            <>
              <h1>Create an account to get started.</h1>
              <SignUp className={styles.signUpForm} />
            </>
          ) : (
            <>
              <h1>Sign in</h1>
              <SignIn className={styles.signInForm} />
            </>
          )}
          <div className={styles.orSeparator}>
            <div />
            or
            <div />
          </div>
          <Button onClick={googleProvider} className={styles.googleButton}>
            <Image
              src="/google-icon.svg"
              height={20}
              width={20}
              alt="google-icon"
            />
            Sign in with Google
          </Button>
        </div>
      </div>
    </>
  );
}
