const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const Payment = require('../models/Payment');

router.post('/subscribe', authMiddleware, async (req, res) => {
    try {
        const { plan, refNumber, method } = req.body;
        
        // Ensure plan is lowercase
        const normalizedPlan = plan.toLowerCase();

        // Create a pending payment
        const payment = new Payment({
            userId: req.user.id,
            plan: normalizedPlan,
            refNumber,
            paymentMethod: method || 'other',
            status: 'pending'
        });

        await payment.save();

        res.json({ message: `Payment submitted for verification. Reference: ${refNumber}` });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Reference number already used.' });
        }
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
