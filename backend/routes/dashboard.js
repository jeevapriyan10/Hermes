const express = require('express');
const router = express.Router();
const { getDB } = require('../services/database');

router.get('/', async (req, res) => {
    try {
        const db = getDB();

        if (!db) {
            return res.status(503).json({
                error: 'Database not available',
                items: [],
                stats: { total: 0, totalUpvotes: 0 }
            });
        }

        // Get all misinformation items, sorted by most recent first
        const allItems = await db.collection('misinformation')
            .find({})
            .sort({ timestamp: -1 })
            .limit(100) // Limit to 100 most recent
            .toArray();

        // Get total stats
        const stats = await db.collection('misinformation').aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    totalUpvotes: { $sum: '$upvotes' },
                }
            }
        ]).toArray();

        res.json({
            items: allItems,
            stats: {
                total: stats[0]?.total || 0,
                totalUpvotes: stats[0]?.totalUpvotes || 0,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Dashboard error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch dashboard data',
            items: [],
        });
    }
});

module.exports = router;
