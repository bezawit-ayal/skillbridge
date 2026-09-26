const express = require('express');
const { generateChatReply } = require('../services/aiService');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/chat', requireAuth, async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
        return res.status(400).json({ message: 'Prompt is required.' });
    }

    const result = await generateChatReply(prompt.trim());
    res.json({ success: true, result });
});

router.post('/feedback', requireAuth, (req, res) => {
    const { quizResults, strengths, areas, recommendations } = req.body;

    res.json({
        success: true,
        feedback: {
            strengths: strengths || ['JavaScript fundamentals', 'Project-based learning'],
            weakAreas: areas || ['Debugging patterns', 'Advanced state management'],
            recommendations: recommendations || ['Review arrays and functions', 'Complete one React practice project'],
            nextSteps: ['Finish the next module', 'Take the quiz again'],
            quizResults: quizResults || 80,
        },
    });
});

module.exports = router;
