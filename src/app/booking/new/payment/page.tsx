import { redirect } from 'next/navigation';

export default function PaymentPage() {
  // Payment page is currently disabled - redirects to home
  redirect('/');
}
