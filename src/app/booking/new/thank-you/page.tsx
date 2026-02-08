import { Suspense } from 'react';
import { ThankYouClient } from './ThankYouClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank You - Discover Berat',
  description: 'Thank you for your booking with Discover Berat.',
};

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouClient />
    </Suspense>
  );
}
