const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    refNumber: { type: String, required: true, unique: true },
    paymentMethod: { type: String, enum: ['telebirr', 'cbe', 'other'], default: 'other' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    amount: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
