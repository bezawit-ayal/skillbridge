const jwt = require('jsonwebtoken');
const { users } = require('../data/seedData');

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'skillbridge-secret');
        const user = users.find((item) => item.id === decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required.' });
    }
    next();
};

const requireMentor = (req, res, next) => {
    if (!req.user || !['mentor', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Mentor access required.' });
    }
    next();
};

const requirePremium = (req, res, next) => {
    if (!req.user || req.user.subscription !== 'premium') {
        return res.status(403).json({
            message: 'This feature is available with Premium.',
            redirectTo: '/subscription',
        });
    }
    next();
};

module.exports = {
    requireAuth,
    requireAdmin,
    requireMentor,
    requirePremium,
};
