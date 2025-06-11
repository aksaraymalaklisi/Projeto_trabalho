const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    // Determine o ambiente com base na chave secreta do Stripe
    const isLiveMode = !process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');

    // Verifique se está usando cartão de teste em modo live
    if (isLiveMode && req.body.paymentMethodId && req.body.paymentMethodId.startsWith('pm_test_')) {
      throw new Error('Cartão de teste usado em modo live');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000, // Mantenha o valor que você estava usando antes
      currency: 'brl',
      automatic_payment_methods: {enabled: true},
      metadata: {
        environment: isLiveMode ? 'production' : 'test'
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      environment: isLiveMode ? 'live' : 'test'
    });
  } catch (error) {
    console.error('Erro ao criar PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
}