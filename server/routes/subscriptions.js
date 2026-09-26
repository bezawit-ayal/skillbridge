const express = require('express');
const { plans } = require('../data/seedData');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/me', requireAuth, (req, res) => {
    const selectedPlan = req.user.subscription === 'premium' ? 'premium' : 'free';
    const activePlan = plans.find((plan) => plan.id === selectedPlan) || plans[0];

    res.json({
        success: true,
        currentPlan: activePlan,
        status: req.user.subscription === 'premium' ? 'Active' : 'Free',
        benefits: activePlan.features,
    });
});

router.post('/create-checkout', requireAuth, (req, res) => {
    const { planId } = req.body;
    const targetPlan = plans.find((plan) => plan.id === planId) || plans[1];

    res.json({
        success: true,
        checkoutUrl: `https://checkout.example.com/${targetPlan.id}`,
        plan: targetPlan,
        message: 'Hosted checkout integration ready for a payment provider.',
    });
});

router.post('/cancel', requireAuth, (req, res) => {
    res.json({ success: true, message: 'Subscription cancellation requested.' });
});

router.get('/plans', (req, res) => {
    res.json({ success: true, plans });
});

module.exports = router;
