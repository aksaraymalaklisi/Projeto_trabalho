const { stripe, config } = require('../../../lib/stripe-config');

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  
  try {
    stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.webhookSecret
    );

    console.log(`Webhook recebido no ambiente: ${config.isLiveMode ? 'LIVE' : 'TEST'}`);
    
    // Processar o evento...
    
    res.json({ received: true });
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}