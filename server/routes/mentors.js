const express = require('express');
const { mentors } = require('../data/seedData');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
    res.json({ success: true, mentors });
});

router.get('/:id', requireAuth, (req, res) => {
    const mentor = mentors.find((item) => item.id === req.params.id);
    if (!mentor) {
        return res.status(404).json({ message: 'Mentor not found.' });
    }

    res.json({ success: true, mentor });
});

router.post('/request', requireAuth, (req, res) => {
    const { mentorId, message } = req.body;

    if (!mentorId || !message) {
        return res.status(400).json({ message: 'Mentor and message are required.' });
    }

    res.json({
        success: true,
        request: {
            id: `request-${Date.now()}`,
            mentorId,
            studentId: req.user.id,
            message,
            status: 'pending',
        },
    });
});

module.exports = router;
