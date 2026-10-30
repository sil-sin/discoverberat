'use client';

import { useAuthContext } from '@/lib/auth/auth-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import styles from '@/components/auth/Auth.module.css';

export function AuthClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthContext();
  const callbackUrl = searchParams.get('callbackUrl');

  useEffect(() => {
    if (!user) return;
    const target = new URL(callbackUrl ?? '/', window.location.origin);
    const path = target.pathname + target.search + target.hash;
    const isLocal = target.origin === window.location.origin && !path.startsWith('//');
    router.replace(isLocal ? path : '/');
  }, [router, callbackUrl, user]);

  return (
    <div className={styles.page}>
      <AuthForm reason={searchParams.get('reason')} />
    </div>
  );
}
