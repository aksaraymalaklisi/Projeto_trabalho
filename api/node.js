const stripe = require('stripe')('sk_test_sua_chave_secreta_de_teste_aqui');

// Criar um pagamento de teste
async function createTestPayment() {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000, // 10.00 BRL (em centavos)
    currency: 'brl',
    payment_method_types: ['card'],
  });
  console.log(paymentIntent.client_secret);
}