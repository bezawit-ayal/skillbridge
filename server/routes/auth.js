const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../data/seedData');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const createToken = (user) =>
    jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'skillbridge-secret', {
        expiresIn: '7d',
    });

router.post('/register', async (req, res) => {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        role,
        username: email.split('@')[0],
        interests: [],
        subscription: 'free',
        bio: '',
        verification: { studentStatus: 'not-applied', womenStatus: 'not-applied' },
    };

    users.push(newUser);

    const token = createToken(newUser);
    return res.status(201).json({ token, user: { ...newUser, password: undefined } });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = createToken(user);
    return res.json({ token, user: { ...user, password: undefined } });
});

router.get('/me', requireAuth, (req, res) => {
    const { password, ...safeUser } = req.user;
    res.json({ user: safeUser });
});

module.exports = router;
