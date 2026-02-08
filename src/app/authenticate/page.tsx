import { Suspense } from 'react';
import { AuthClient } from './AuthClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Discover Berat',
  description: 'Sign in or create an account with Discover Berat.',
};

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthClient />
    </Suspense>
  );
}
