'use client';

import Button from '@/components/simple/Button';
import { useRouter } from 'next/navigation';

export function HomeClient() {
  const router = useRouter();

  return (
    <Button
      className="viewAll"
      variant="tertiary"
      onClick={() => {
        router.push('/tours');
      }}
    >
      View all tours
    </Button>
  );
}
