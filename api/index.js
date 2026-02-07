const app = require('../backend/index.js');

app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is working!", env_check: process.env.NODE_ENV });
});

module.exports = (req, res) => {
    return app(req, res);
};
