import { buffer } from 'micro';
import Stripe from 'stripe';
import { Resend } from 'resend';

// ======================
// 1. CONFIGURAÇÃO INICIAL
// ======================

// Função para obter o segredo do webhook correto (única e robusta)
function getWebhookSecret() {
  const secret =
    process.env.STRIPE_WEBHOOK_SECRET ||
    (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')
      ? process.env.STRIPE_WEBHOOK_SECRET_TEST
      : process.env.STRIPE_WEBHOOK_SECRET_LIVE);

  if (!secret) {
    throw new Error('Nenhum segredo de webhook configurado');
  }
  return secret;
}

// Validação das variáveis de ambiente essenciais
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Variável STRIPE_SECRET_KEY não configurada');
}
if (!process.env.RESEND_API_KEY) {
  throw new Error('Variável RESEND_API_KEY não configurada');
}

// Configuração do Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil', // Atualize para a versão mais recente
});

// Configuração do Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_VERIFIED_EMAIL || 'onboarding@resend.dev';

// ======================
// 2. FUNÇÕES AUXILIARES
// ======================

/**
 * Template de e-mail de confirmação
 */
function getConfirmationEmail(name) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <p>Olá <strong>${name}</strong>!</p>
      <p>Seu pagamento foi confirmado com sucesso! 🎉</p>
      <p>Recebemos seu pedido e já estamos começando a produção.</p>
      <p>Você receberá atualizações em breve.</p>
      <br/>
      <p style="font-size: 12px; color: #666;">
        Este e-mail foi gerado automaticamente após confirmação de pagamento.
      </p>
    </div>
  `;
}

// ======================
// 3. HANDLER PRINCIPAL
// ======================

export const config = {
  api: { bodyParser: false }, // Necessário para webhooks
};

export default async function handler(req, res) {
  // Verifica o método HTTP
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: 'Método não permitido',
      allowed: ['POST'],
    });
  }

  try {
    // Verifica a assinatura do webhook
    const sig = req.headers['stripe-signature'];
    const buf = await buffer(req);
    const webhookSecret = getWebhookSecret();

    const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    console.log(`🔔 Evento recebido: ${event.type}`);

    // Processa eventos de checkout completo
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Extrai dados do cliente
      const email = session.customer_details?.email || session.customer_email;
      const name = session.metadata?.name || 'Cliente';

      if (!email) {
        console.warn('⚠️ E-mail não encontrado na sessão:', session.id);
        return res.status(200).json({ received: true });
      }

      // Envia e-mail de confirmação
      try {
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: 'Pagamento confirmado! Pedido recebido',
          html: getConfirmationEmail(name),
        });

        console.log(`✉️ E-mail enviado para: ${email}`);

        // Notificação para admin (opcional)
        if (process.env.ADMIN_EMAIL) {
          await resend.emails.send({
            from: fromEmail,
            to: process.env.ADMIN_EMAIL,
            subject: `🎉 Novo pedido de ${name}`,
            html: `
              <p>Novo pedido confirmado:</p>
              <ul>
                <li><strong>Cliente:</strong> ${name}</li>
                <li><strong>E-mail:</strong> ${email}</li>
                <li><strong>ID Sessão:</strong> ${session.id}</li>
                <li><strong>Valor:</strong> ${(session.amount_total / 100).toFixed(2)} ${session.currency}</li>
              </ul>
            `,
          });
        }
      } catch (emailError) {
        console.error('❌ Erro ao enviar e-mail:', emailError);
        // Não quebra o fluxo do webhook
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Erro no webhook:', {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });

    return res.status(400).json({
      error: 'Erro no processamento',
      message: err.message,
    });
  }
}
// ...fim do arquivo...