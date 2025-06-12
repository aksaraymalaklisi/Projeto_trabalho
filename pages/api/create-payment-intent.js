const { getStripeConfig } = require('../../lib/stripe-config');

export default async function handler(req, res) {
  try {
    const forceTestMode = req.body.forceTestMode === true;

    const { stripe, config } = getStripeConfig({ forceTestMode });

    // Impede uso de cartão de teste em ambiente live
    if (
      config.isLiveMode &&
      req.body.paymentMethodId &&
      req.body.paymentMethodId.startsWith('pm_test_')
    ) {
      throw new Error('Cartão de teste usado em modo live.');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000,
      currency: 'brl',
      automatic_payment_methods: { enabled: true },
      metadata: {
        environment: config.environment
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      environment: config.environment
    });
  } catch (error) {
    console.error('Erro ao criar PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
}
