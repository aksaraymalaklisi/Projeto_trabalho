import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const handleStripeCheckout = async (pkgPrice: number) => {
  try {
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Falha ao carregar o Stripe');
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(pkgPrice * 100), // Garante que é inteiro (centavos)
        currency: 'eur',
        mode: 'payment', // Adicionado explicitamente
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro na API');
    }

    const { url, error } = await response.json();

    if (error) {
      throw new Error(error);
    }

    if (!url) {
      throw new Error('URL de checkout não recebida');
    }

    // Redireciona para o checkout do Stripe
    const { error: redirectError } = await stripe.redirectToCheckout({ url });
    
    if (redirectError) {
      throw new Error(redirectError.message);
    }

  } catch (error) {
    console.error('Erro no processo de checkout:', error);
    // Adicione aqui sua lógica de tratamento de erros (ex: mostrar alerta para o usuário)
    throw error; // Rejeita a promise para tratamento externo
  }
};