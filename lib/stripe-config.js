const stripeLib = require('stripe');

function getStripeConfig({ forceTestMode = false } = {}) {
  const liveKey = process.env.STRIPE_SECRET_KEY_LIVE;
  const testKey = process.env.STRIPE_SECRET_KEY_TEST;

  const isLiveMode = !forceTestMode && liveKey?.startsWith('sk_live_');

  const stripeSecretKey = isLiveMode ? liveKey : testKey;

  if (!stripeSecretKey) {
    throw new Error('Stripe secret key não definida corretamente.');
  }

  const stripe = stripeLib(stripeSecretKey);

  const config = {
    isLiveMode,
    environment: isLiveMode ? 'production' : 'test'
  };

  return { stripe, config };
}

module.exports = { getStripeConfig };
