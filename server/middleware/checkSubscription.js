const User = require('../models/User');

module.exports = (requiredPlan) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            const sub = user.subscription;

            if (!sub.isActive && requiredPlan !== 'free') {
                return res.status(403).json({ message: 'Active premium subscription required' });
            }

            if (sub.endDate && new Date() > sub.endDate) {
                // Auto-deactivate expired subscription
                user.subscription.isActive = false;
                await user.save();
                return res.status(403).json({ message: 'Subscription expired. Please renew.' });
            }

            next();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
};
