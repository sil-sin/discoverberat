import '@/styles/globals.css';
import { AuthProvider } from '@/utils/auth/auth-provider';
import Layout from '@/components/Layout';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import { SITE_URL, isProduction } from '@/utils/site';

const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
});
const body = Figtree({ subsets: ['latin', 'latin-ext'], variable: '--font-body' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: isProduction ? undefined : { index: false, follow: false },
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
