const express = require('express');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const contacts = await Contact.find({ userId: req.user.id });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, phone, relationship } = req.body;
        const contact = new Contact({
            userId: req.user.id,
            name,
            phone,
            relationship
        });
        await contact.save();
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: 'Contact deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
