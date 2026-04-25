const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', authMiddleware, async (req, res) => {
    try {
        const { start, destination } = req.body;
        
        // Mock route generation with safety scores
        const routes = [
            {
                id: 'shortest',
                name: 'Shortest Path',
                distance: '4.2 km',
                duration: '12 mins',
                safetyScore: 75,
                color: 'red',
                indicator: '🔴 Risky'
            },
            {
                id: 'fastest',
                name: 'Fastest Path',
                distance: '5.1 km',
                duration: '10 mins',
                safetyScore: 85,
                color: 'yellow',
                indicator: '🟡 Moderate'
            },
            {
                id: 'safest',
                name: 'Safest Path',
                distance: '5.5 km',
                duration: '14 mins',
                safetyScore: 98,
                color: 'green',
                indicator: '🟢 Safe'
            }
        ];

        res.json(routes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
