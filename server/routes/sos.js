const express = require('express');
const SOSAlert = require('../models/SOSAlert');
const Contact = require('../models/Contact');
const User = require('../models/User');
const smsService = require('../services/smsService');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/trigger', authMiddleware, async (req, res) => {
    try {
        const { lat, lng, message } = req.body;
        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
        
        // Fetch user and contacts concurrently
        const [user, contacts] = await Promise.all([
            User.findById(req.user.id),
            Contact.find({ userId: req.user.id })
        ]);

        const alert = new SOSAlert({
            userId: req.user.id,
            location: { lat, lng },
            mapsLink,
            message
        });

        // 1. Database Save
        const savePromise = alert.save();

        // 2. Family SMS
        const familyNumbers = contacts.map(c => c.phone);
        const familySmsPromise = familyNumbers.length > 0 
            ? smsService.sendEmergencySMS(familyNumbers, { userName: user.name, location: { lat, lng }, status: 'HIGH RISK' })
            : Promise.resolve();

        // 3. Police SMS
        const policeNumber = process.env.POLICE_EMERGENCY_NUMBER || '+1234567890'; // Use env or fallback
        const policeSmsPromise = smsService.sendEmergencySMS(policeNumber, { userName: user.name, location: { lat, lng }, status: 'HIGH RISK' });

        // 4. WebSocket Broadcast
        // Since we attached `io` to `req` in index.js, we can use it here
        if (req.io) {
            req.io.to('admin_room').emit('emergency_trigger', {
                alertId: alert._id,
                userId: user._id,
                userName: user.name,
                location: { lat, lng },
                message,
                status: 'pending',
                timestamp: alert.createdAt
            });
        }

        // Execute all parallel tasks
        await Promise.all([savePromise, familySmsPromise, policeSmsPromise]);

        res.status(201).json(alert);
    } catch (err) {
        console.error("SOS Trigger Error:", err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/all', authMiddleware, async (req, res) => {
    try {
        // Admin only check could be added here
        const alerts = await SOSAlert.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const alert = await SOSAlert.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(alert);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
