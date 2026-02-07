// Vercel serverless function wrapper for Express app
const app = require('../backend/index.js');

// Export handler for Vercel
module.exports = async (req, res) => {
    // Let Express handle the request
    return app(req, res);
};
