const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Valor é obrigatório'],
    min: [0, 'Valor não pode ser negativo']
  },
  hoursWorked: {
    type: Number,
    required: [true, 'Horas trabalhadas são obrigatórias'],
    min: [0, 'Horas não podem ser negativas']
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'rejected'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'pix', 'credit_card'],
    required: true
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Índices para melhor performance
paymentSchema.index({ freelancer: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 