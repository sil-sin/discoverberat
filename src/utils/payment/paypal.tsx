'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useAuthContext } from '@/utils/auth/auth-provider';
import Button from '@/components/simple/Button';
import { toast } from '@/components/simple/Toast';
import { capturePayPalOrder, createPayPalOrder } from './actions';

type Props = {
  bookingId: string;
  onPaid: () => void;
};

const PaypalCheckoutButton = ({ bookingId, onPaid }: Props) => {
  const { user } = useAuthContext();
  if (!user) return null;

  return (
    <>
      <p>
        Refunds exclude PayPal fees. See our{' '}
        <Button variant="link" href="/refund-policy">
          refund policy
        </Button>
        .
      </p>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
          currency: 'EUR',
        }}
      >
        <PayPalButtons
          style={{ shape: 'rect', color: 'gold', layout: 'vertical', tagline: false }}
          createOrder={async () =>
            createPayPalOrder(await user.getIdToken(), bookingId)
          }
          onApprove={async ({ orderID }) => {
            await capturePayPalOrder(await user.getIdToken(), bookingId, orderID);
            onPaid();
          }}
          onError={(error) => {
            console.error('PayPal payment failed:', error);
            toast.error('Payment failed. Please try again or pay on location.');
          }}
        />
      </PayPalScriptProvider>
    </>
  );
};

export default PaypalCheckoutButton;
