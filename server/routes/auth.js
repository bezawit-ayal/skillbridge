const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
    console.log(">>> REGISTER ATTEMPT:", req.body);

    try {
        const { name, email, password } = req.body;

        /* VALIDATION */
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        /* CHECK EXISTING USER */
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        /* CREATE USER */
        const user = new User({ name, email, password });
        await user.save();

        /* CREATE TOKEN */
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscription: user.subscription
            }
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ message: err.message || "Registration failed" });
    }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
    console.log(">>> LOGIN ATTEMPT:", req.body);

    try {
        const { email, password } = req.body;

        /* VALIDATION */
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        /* FIND USER */
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        /* CHECK PASSWORD */
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        /* CREATE TOKEN */
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscription: user.subscription
            }
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;