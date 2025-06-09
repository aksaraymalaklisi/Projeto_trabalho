import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const handleStripe = async (pkgPrice: number) => {
  const stripe = await stripePromise;

  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: pkgPrice * 100, // em centavos
      currency: 'eur',
    }),
  });

  const data = await response.json();

  if (data.url) {
    window.location.href = data.url;
  } else {
    console.error('Erro ao criar sessão de checkout', data.error);
  }
};


