const User = require('../models/User');

module.exports = (requiredPlan) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            const plan = user.subscriptionStatus.plan;
            const expiresAt = user.subscriptionStatus.expiresAt;

            if (plan === 'free' && requiredPlan !== 'free') {
                return res.status(403).json({ message: 'Premium subscription required' });
            }

            if (expiresAt && new Date() > expiresAt) {
                return res.status(403).json({ message: 'Subscription expired' });
            }

            next();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
};
