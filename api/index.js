const app = require('../backend/index.js');
const { connectDB } = require('../backend/services/database.js');

module.exports = async (req, res) => {
    // Ensure database is connected before handling the request
    try {
        await connectDB();
    } catch (error) {
        console.error('Warning: Database connection failed during cold start:', error.message);
        // We continue because app might handle it gracefully or we might not need DB for all routes
    }
    return app(req, res);
};
