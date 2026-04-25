const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
}));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`\n[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log("BODY:", JSON.stringify(req.body, null, 2));
    }
    next();
});

// Routes
app.get('/', (req, res) => res.send('SafeRoute API Active'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/monitor', require('./routes/monitor'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/location', require('./routes/location'));
app.use('/api/payment', require('./routes/payment'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("!!! SERVER ERROR !!!", err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST", "PATCH"]
    }
});

// Attach io to req for use in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Socket Connection Handling
io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);
    
    socket.on('join_admin', () => {
        socket.join('admin_room');
        console.log(`👮 Admin joined: ${socket.id}`);
    });

    socket.on('disconnect', () => {
        console.log(`🛑 Socket disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

