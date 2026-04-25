const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    status: { type: String, enum: ['pending', 'responded', 'resolved'], default: 'pending' },
    mapsLink: { type: String },
    message: { type: String, default: 'Emergency SOS Triggered' }
}, { timestamps: true });

module.exports = mongoose.model('SOSAlert', sosAlertSchema);
