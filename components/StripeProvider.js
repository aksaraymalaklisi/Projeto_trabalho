import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function StripeProvider({ children }) {
  const isTestMode = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_');
  
  return (
    <div>
      {isTestMode && (
        <div style={{ 
          background: '#ff9800', 
          color: 'white', 
          padding: '10px', 
          textAlign: 'center' 
        }}>
          🧪 MODO TESTE - Stripe Test Environment
        </div>
      )}
      {children}
    </div>
  );
}