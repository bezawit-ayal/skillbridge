const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillbridge';

    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected');
    } catch (error) {
        console.warn('MongoDB connection failed, app will use in-memory fallback data:', error.message);
    }
};

module.exports = connectDB;
