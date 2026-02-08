// Vercel Serverless Function Adapter
// This imports the actual backend application so Vercel uses the EXACT same logic as Render
const app = require('../backend/index.js');

module.exports = app;
