const mongoose = require('mongoose');

const safetyCheckSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['PENDING', 'SAFE', 'EMERGENCY'], default: 'PENDING' },
    lastLocation: {
        lat: Number,
        lng: Number,
        address: String
    },
    startTime: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    triggeredBy: { type: String, enum: ['ACCIDENT', 'INACTIVITY', 'MANUAL'], default: 'ACCIDENT' }
}, { timestamps: true });

module.exports = mongoose.model('SafetyCheck', safetyCheckSchema);
