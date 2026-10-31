'use client';

import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export function HomeClient() {
  const router = useRouter();

  return (
    <div className="viewAll">
      <Button variant="secondary" onClick={() => router.push('/tours')}>
        View all tours
      </Button>
    </div>
  );
}
