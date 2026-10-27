'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useAuthContext } from '@/utils/auth/auth-provider';
import { capturePayPalOrder, createPayPalOrder } from './actions';

type Props = {
  bookingId: string;
  onPaid: () => void;
  onError: (error: unknown) => void;
};

const PaypalCheckoutButton = ({ bookingId, onPaid, onError }: Props) => {
  const { user } = useAuthContext();
  if (!user) return null;

  return (
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
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalCheckoutButton;
