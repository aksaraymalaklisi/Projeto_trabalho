const express = require('express');
const router = express.Router();

const freelancerRoutes = require('./freelancer.routes');
const paymentRoutes = require('./payment.routes');
const authRoutes = require('./auth.routes');

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de freelancers
router.use('/freelancers', freelancerRoutes);

// Rotas de pagamentos
router.use('/payments', paymentRoutes);

module.exports = router; 