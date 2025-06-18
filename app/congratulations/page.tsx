'use client'; // para App Router

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe('pk_test_xxxxxxxxxxxxxxxxxxxx'); // sua chave pública do Stripe

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100, // R$1,00
          currency: 'brl',
          test_mode: true,
        }),
      });

      const data = await response.json();

      if (data.url) {
        const stripe = await stripePromise;
        window.location.href = data.url; // redireciona para o Stripe
      } else {
        console.error('Erro ao obter URL de checkout:', data);
      }
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
    }

    setLoading(false);
  };

  return (
    <button onClick={handleCheckout} disabled={loading} style={{ padding: '1rem', fontSize: '1rem' }}>
      {loading ? 'Redirecionando...' : 'Pagar R$1,00'}
    </button>
  );
}
