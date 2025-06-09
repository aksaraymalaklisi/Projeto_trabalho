import { buffer } from 'micro';
import Stripe from 'stripe';
import { Resend } from 'resend';

// Configuração do Stripe (modo teste/produção automático baseado na chave)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil', // Mantenha a versão mais recente
});

export const config = {
  api: { bodyParser: false },
};

const resend = new Resend(process.env.RESEND_API_KEY);

// Exemplo para verificar programaticamente
if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_')) {
  console.log('✅ Modo teste ativo');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let event;

  try {
    const sig = req.headers['stripe-signature'];
    const buf = await buffer(req);

    // Verifica se a chave webhook é de teste ou produção
    const webhookSecret = 
      process.env.STRIPE_WEBHOOK_SECRET || 
      (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') 
        ? process.env.STRIPE_WEBHOOK_SECRET_TEST 
        : process.env.STRIPE_WEBHOOK_SECRET_LIVE);

    if (!webhookSecret) {
      throw new Error('Webhook secret não configurado');
    }

    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Debug: Log do evento recebido (útil para teste)
  console.log('🔔 Evento recebido:', event.type);

  // Processa eventos de sucesso de pagamento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Extrai dados do cliente
    const email = session.customer_details?.email || session.customer_email;
    const name = session.metadata?.name || 'Cliente';

    if (!email) {
      console.warn('⚠️ E-mail não encontrado na sessão:', session.id);
      return res.status(200).json({ received: true }); // Stripe espera 200 mesmo em erros
    }

    // Template do e-mail
    const html = `
      <p>Olá <strong>${name}</strong>!</p>
      <p>Seu pagamento foi confirmado com sucesso!</p>
      <p>Recebemos seu pedido e já estamos começando a produção do seu logo.</p>
      <p>Em breve você receberá o contato do designer.</p>
      <br/>
      <p><small>(Esse e-mail foi gerado automaticamente após o pagamento no Stripe.)</small></p>
    `;

    try {
      // Envia e-mail para o cliente
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Pagamento confirmado! Pedido recebido',
        html,
      });

      // Envia notificação para o administrador (opcional)
      if (process.env.ADMIN_EMAIL) {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: process.env.ADMIN_EMAIL,
          subject: `🎉 Novo pedido de ${name}`,
          html: `<p>Novo pedido confirmado:</p>
                 <ul>
                   <li>Cliente: ${name}</li>
                   <li>E-mail: <a href="mailto:${email}">${email}</a></li>
                   <li>ID Sessão: ${session.id}</li>
                 </ul>`
        });
      }

      console.log('✉️ E-mails enviados com sucesso para:', email);
      return res.status(200).json({ received: true });
    } catch (e) {
      console.error('❌ Erro ao enviar e-mail:', e);
      // Não falha o webhook para evitar retentativas desnecessárias
      return res.status(200).json({ received: true });
    }
  }

  // Responde a outros eventos Stripe (não tratados)
  res.status(200).json({ received: true });
}