import '@/styles/globals.css';
import { AuthProvider } from '@/utils/auth/auth-provider';
import Layout from '@/components/Layout';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';

const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
});
const body = Figtree({ subsets: ['latin', 'latin-ext'], variable: '--font-body' });

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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
