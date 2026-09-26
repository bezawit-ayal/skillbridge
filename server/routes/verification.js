const express = require('express');
const { verifications } = require('../data/seedData');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/student', requireAuth, (req, res) => {
    const { fullName, institutionName, studentIdNumber, country, expectedGraduationYear, documentType } = req.body;

    if (!fullName || !institutionName || !studentIdNumber) {
        return res.status(400).json({ message: 'Required student verification fields are missing.' });
    }

    const submission = {
        id: `verification-${Date.now()}`,
        userId: req.user.id,
        type: 'student',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
        rejectionReason: '',
        documentReference: `${req.user.id}/student-verification/${documentType || 'document'}`,
    };

    verifications.push(submission);
    res.status(201).json({ success: true, verification: submission });
});

router.post('/women', requireAuth, (req, res) => {
    const { programName, reason, country } = req.body;

    if (!programName || !country) {
        return res.status(400).json({ message: 'Program name and country are required.' });
    }

    const submission = {
        id: `women-${Date.now()}`,
        userId: req.user.id,
        type: 'women_program',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
        rejectionReason: '',
        documentReference: `${req.user.id}/women-program/${programName}`,
    };

    verifications.push(submission);
    res.status(201).json({ success: true, verification: submission });
});

router.get('/status', requireAuth, (req, res) => {
    const checks = verifications.filter((item) => item.userId === req.user.id);
    res.json({ success: true, verifications: checks });
});

module.exports = router;
