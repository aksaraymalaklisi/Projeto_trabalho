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


// Para testar pagamentos no modo teste do Stripe, certifique-se de que está usando as chaves de API de teste da Stripe.
// No checkout, utilize os cartões de teste fornecidos pela Stripe, como: 4242 4242 4242 4242 (qualquer data de validade e CVC).
// Veja mais exemplos em: https://stripe.com/docs/testing

// Não é necessário alterar o código para testar; apenas use os cartões de teste no formulário de pagamento.