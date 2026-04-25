const express = require('express');
const Trip = require('../models/Trip');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/start', authMiddleware, async (req, res) => {
    try {
        const { startPoint, destination } = req.body;
        const trip = new Trip({
            userId: req.user.id,
            startPoint,
            destination
        });
        await trip.save();
        res.status(201).json(trip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id/end', authMiddleware, async (req, res) => {
    try {
        const { status, duration, distance } = req.body;
        const trip = await Trip.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { status, duration, distance },
            { new: true }
        );
        res.json(trip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/history', authMiddleware, async (req, res) => {
    try {
        const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('userId', 'name');
        res.json(trip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
