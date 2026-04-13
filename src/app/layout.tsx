import '@/styles/globals.css';
import { AuthProvider } from '@/utils/auth/auth-provider';
import Layout from '@/components/Layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Berat - Tour Operator',
  description: 'Discover Berat - Guided tours, activities, and excursions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
