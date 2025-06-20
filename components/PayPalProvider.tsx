// This file is required to initialize the PayPal JS SDK in your app.
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import React from 'react';

export function PayPalProvider({ children }: { children: React.ReactNode }) {
  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '', currency: 'EUR' }}>
      {children}
    </PayPalScriptProvider>
  );
}
