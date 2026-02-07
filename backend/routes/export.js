const express = require('express');
const router = express.Router();
const { getDB } = require('../services/database');

router.get('/', async (req, res) => {
    try {
        const db = getDB();
        if (!db) {
            return res.status(503).json({ error: 'Database not available' });
        }

        // Get top 5 trending (most upvoted in last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const topTrending = await db.collection('misinformation')
            .find({ timestamp: { $gte: sevenDaysAgo } })
            .sort({ upvotes: -1, timestamp: -1 })
            .limit(5)
            .toArray();

        // Get last 25 recent detections
        const recentNews = await db.collection('misinformation')
            .find({})
            .sort({ timestamp: -1 })
            .limit(25)
            .toArray();

        // Combine and deduplicate
        const allItems = [...topTrending];
        const trendingIds = new Set(topTrending.map(item => item._id.toString()));

        for (const item of recentNews) {
            if (!trendingIds.has(item._id.toString())) {
                allItems.push(item);
            }
        }

        // Generate CSV
        const headers = [
            'ID',
            'Timestamp',
            'Category',
            'Content',
            'Verdict',
            'Confidence',
            'Explanation',
            'Upvotes',
            'Cluster ID',
            'Variations',
            'Type'
        ];

        const csvRows = [headers.join(',')];

        allItems.forEach((item, index) => {
            const type = index < 5 ? 'Trending' : 'Recent';
            const row = [
                item._id.toString(),
                new Date(item.timestamp).toISOString(),
                item.category || 'general',
                `"${(item.text || '').replace(/"/g, '""')}"`, // Escape quotes
                'misinformation',
                item.confidence || 0,
                `"${(item.explanation || '').replace(/"/g, '""')}"`,
                item.upvotes || 0,
                item.clusterId || '',
                item.variations || 0,
                type
            ];
            csvRows.push(row.join(','));
        });

        const csv = csvRows.join('\n');

        // Set headers for download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="hermes-report-${Date.now()}.csv"`);
        res.send(csv);

    } catch (error) {
        console.error('Export error:', error.message);
        res.status(500).json({ error: 'Failed to generate export' });
    }
});

module.exports = router;
