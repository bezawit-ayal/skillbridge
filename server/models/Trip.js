const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startPoint: { type: String, required: true },
    destination: { type: String, required: true },
    path: [{
        lat: Number,
        lng: Number,
        timestamp: { type: Date, default: Date.now }
    }],
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    safetyScore: { type: Number, default: 100 },
    duration: { type: String },
    distance: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
