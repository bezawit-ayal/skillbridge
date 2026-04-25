const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const SafetyCheck = require('../models/SafetyCheck');
const SOSAlert = require('../models/SOSAlert');
const User = require('../models/User');

// @route   POST api/monitor/trigger
// @desc    Trigger a server-side 5-minute safety check
router.post('/trigger', auth, async (req, res) => {
    try {
        const { lastLocation, triggeredBy } = req.body;
        
        // Expiration is 5 minutes from now
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const check = new SafetyCheck({
            userId: req.user.id,
            lastLocation,
            expiresAt,
            triggeredBy
        });

        await check.save();

        // Start background timeout for this specific check
        // Note: For a production system, use a task queue like BullMQ or a CRON job.
        // For this demo, we use setTimeout.
        setTimeout(async () => {
            const currentCheck = await SafetyCheck.findById(check._id);
            if (currentCheck && currentCheck.status === 'PENDING') {
                // AUTO TRIGGER SOS
                currentCheck.status = 'EMERGENCY';
                await currentCheck.save();

                const user = await User.findById(req.user.id);
                
                // Create actual SOS alert
                const sos = new SOSAlert({
                    userId: user._id,
                    location: lastLocation,
                    status: 'active',
                    message: `AUTO-SOS: User failed to respond to ${triggeredBy} safety check.`
                });
                await sos.save();

                console.log(`🚨 AUTO-SOS Triggered for user ${user.name}`);
            }
        }, 5 * 60 * 1000);

        res.status(201).json({ 
            success: true, 
            message: 'Server-side safety monitoring started',
            checkId: check._id,
            expiresAt 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST api/monitor/respond
// @desc    User responds "I'm Safe"
router.post('/respond', auth, async (req, res) => {
    try {
        const { checkId } = req.body;
        const check = await SafetyCheck.findById(checkId);

        if (!check) return res.status(404).json({ message: 'Safety check not found' });
        if (check.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        check.status = 'SAFE';
        await check.save();

        res.json({ success: true, message: 'Glad you are safe! Monitoring resolved.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
