// Inicialize o Stripe no modo teste
const stripe = Stripe('pk_test_sua_chave_de_teste_aqui');

// Exemplo: Redirecionar para o Checkout do Stripe (modo teste)
stripe.redirectToCheckout({
  lineItems: [{ price: 'preco_teste_123', quantity: 1 }],
  mode: 'payment',
  successUrl: 'https://projeto-trabalho-iota.vercel.app/sucesso',
  cancelUrl: 'https://projeto-trabalho-iota.vercel.app/cancelado',
});