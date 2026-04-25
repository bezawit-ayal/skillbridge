const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();

// Real-time location update (3-5 second intervals)
router.post('/update', authMiddleware, async (req, res) => {
    try {
        const { lat, lng } = req.body;
        
        // Broadcast immediately to the Police Dashboard via WebSockets
        if (req.io) {
            req.io.to('admin_room').emit('live_location', {
                userId: req.user.id,
                location: { lat, lng },
                timestamp: new Date()
            });
        }

        // We do not save to DB on every 3 second tick to avoid database overload.
        // The DB is updated via trips/location every 10-15s, but WebSockets provide the real-time speed.
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Location Update Error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
