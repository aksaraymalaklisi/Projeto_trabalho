import { loadStripe } from '@stripe/stripe-js';

export const handleStripeCheckout = async (stripeUrl: string) => {
  try {
    // Validação da URL
    if (!stripeUrl || typeof stripeUrl !== 'string') {
      throw new Error('URL do Stripe não fornecida ou inválida');
    }

    // Verifica se é uma URL válida do Stripe
    if (!stripeUrl.startsWith('https://buy.stripe.com/')) {
      throw new Error('URL do Stripe inválida');
    }

    // Redireciona diretamente para a URL do Stripe
    window.open(stripeUrl, '_blank');
    
  } catch (error) {
    console.error('Erro ao abrir checkout do Stripe:', error);
    alert('Erro ao abrir página de pagamento. Tente novamente.');
    throw error;
  }
};