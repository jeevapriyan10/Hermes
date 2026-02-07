const { MongoClient } = require('mongodb');

let db = null;
let client = null;

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri || mongoUri.includes('your_mongodb')) {
            console.log('⚠️  MongoDB URI not configured. Running without database.');
            return null;
        }

        client = new MongoClient(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        await client.connect();
        db = client.db(process.env.MONGO_DB_NAME || 'hermes_ai');

        console.log('✅ Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        db = null;
        throw error;
    }
};

const getDB = () => {
    return db;
};

const closeDB = async () => {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeDB();
    process.exit(0);
});

module.exports = {
    connectDB,
    getDB,
    closeDB,
};
