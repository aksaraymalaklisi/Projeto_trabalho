const { stripe, config } = require('../../lib/stripe-config');

export default async function handler(req, res) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000,
      currency: 'brl',
      metadata: {
        environment: config.isLiveMode ? 'production' : 'test'
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      environment: config.isLiveMode ? 'live' : 'test'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}