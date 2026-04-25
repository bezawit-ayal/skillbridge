const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    console.log(">>> REGISTER ATTEMPT:", req.body);
    try {
        const { name, email, password } = req.body;
        
        console.log("Checking for existing user...");
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("Creating new user instance...");
        const user = new User({ name, email, password });
        
        console.log("Saving user to DB...");
        await user.save();
        console.log("User saved successfully!");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ 
            success: true,
            message: "User created successfully",
            token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (err) {
        console.error("!!! REGISTER CRASH !!!", err);
        res.status(500).json({ message: err.message || "Registration failed" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, subscriptionStatus: user.subscriptionStatus } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
