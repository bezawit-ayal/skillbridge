const express = require('express');
const { users } = require('../data/seedData');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
    const user = users.find((item) => item.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'Profile not found.' });
    }

    const { password, ...safe } = user;
    res.json({ success: true, profile: safe });
});

router.put('/', requireAuth, (req, res) => {
    const index = users.findIndex((user) => user.id === req.user.id);
    if (index === -1) {
        return res.status(404).json({ message: 'User not found.' });
    }

    users[index] = { ...users[index], ...req.body };
    const { password, ...safe } = users[index];
    res.json({ success: true, profile: safe });
});

module.exports = router;
