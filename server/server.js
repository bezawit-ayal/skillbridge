const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));

app.use(express.json({ limit: '2mb' }));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: { message: 'Too many login attempts. Please try again later.' },
});

app.use('/api/auth', authLimiter);

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'SkillBridge API is running' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/verification', require('./routes/verification'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/projects', require('./routes/projects'));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
    });
});

connectDB();

app.listen(PORT, () => {
    console.log(`SkillBridge server listening on http://localhost:${PORT}`);
});
