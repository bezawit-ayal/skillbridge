const express = require('express');
const SOSAlert = require('../models/SOSAlert');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/trigger', authMiddleware, async (req, res) => {
    try {
        const { lat, lng, message } = req.body;
        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
        
        const alert = new SOSAlert({
            userId: req.user.id,
            location: { lat, lng },
            mapsLink,
            message
        });

        await alert.save();
        res.status(201).json(alert);
    } catch (err) {
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
