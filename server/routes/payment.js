const express = require('express');
const User = require('../models/User');
const Payment = require('../models/Payment');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const calculateEndDate = (plan) => {
    const date = new Date();
    if (plan === 'daily') date.setDate(date.getDate() + 1);
    else if (plan === 'weekly') date.setDate(date.getDate() + 7);
    else if (plan === 'monthly') date.setDate(date.getDate() + 30);
    return date;
};

// 1. Automated API Confirmation (e.g., webhook callback)
router.post('/confirm', authMiddleware, async (req, res) => {
    try {
        const { plan, paymentSuccess } = req.body;
        
        if (!paymentSuccess) {
            return res.status(400).json({ message: 'Payment failed' });
        }

        const normalizedPlan = plan.toLowerCase();
        const startDate = new Date();
        const endDate = calculateEndDate(normalizedPlan);

        const user = await User.findByIdAndUpdate(req.user.id, {
            subscription: {
                plan: normalizedPlan,
                startDate,
                endDate,
                isActive: true
            }
        }, { new: true });

        res.json({ message: 'Subscription activated', subscription: user.subscription });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Admin routes for manual verifications
router.get('/pending', authMiddleware, async (req, res) => {
    try {
        // Here we'd verify admin role in production
        const pendingPayments = await Payment.find({ status: 'pending' }).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(pendingPayments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/approve/:id', authMiddleware, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        if (payment.status !== 'pending') return res.status(400).json({ message: 'Payment already processed' });

        payment.status = 'approved';
        await payment.save();

        const startDate = new Date();
        const endDate = calculateEndDate(payment.plan);

        await User.findByIdAndUpdate(payment.userId, {
            subscription: {
                plan: payment.plan,
                startDate,
                endDate,
                isActive: true
            }
        });

        res.json({ message: 'Payment approved and subscription activated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/reject/:id', authMiddleware, async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        res.json({ message: 'Payment rejected', payment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
