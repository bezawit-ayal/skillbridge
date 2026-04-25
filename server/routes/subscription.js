const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/subscribe', authMiddleware, async (req, res) => {
    try {
        const { plan } = req.body;
        let duration = 0;
        if (plan === 'weekly') duration = 7;
        else if (plan === 'monthly') duration = 30;
        else if (plan === 'yearly') duration = 365;

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + duration);

        const user = await User.findByIdAndUpdate(req.user.id, {
            subscriptionStatus: { plan, expiresAt }
        }, { new: true });

        res.json({ message: `Successfully subscribed to ${plan} plan`, subscriptionStatus: user.subscriptionStatus });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
