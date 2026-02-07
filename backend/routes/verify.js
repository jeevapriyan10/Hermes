const express = require('express');
const router = express.Router();
const { getDB } = require('../services/database');
const { analyzeText } = require('../services/aiService');

router.post('/', async (req, res) => {
    try {
        const { text } = req.body;

        // Validate input
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Text is required and must be a string' });
        }

        if (text.trim().length === 0) {
            return res.status(400).json({ error: 'Text cannot be empty' });
        }

        if (text.length > 5000) {
            return res.status(400).json({ error: 'Text is too long (max 5000 characters)' });
        }

        // Analyze with AI
        const aiResult = await analyzeText(text.trim());

        // Store in database if misinformation detected
        const db = getDB();
        if (db && aiResult.is_misinformation) {
            try {
                await db.collection('misinformation').insertOne({
                    text: text.trim(),
                    category: aiResult.category,
                    confidence: aiResult.confidence,
                    explanation: aiResult.explanation,
                    timestamp: new Date(),
                    upvotes: 0,
                });
            } catch (dbError) {
                console.error('❌ Database error:', dbError.message);
                // Continue even if DB insert fails
            }
        }

        // Return result
        res.json({
            verdict: aiResult.is_misinformation ? 'misinformation' : 'reliable',
            is_misinformation: aiResult.is_misinformation,
            confidence: aiResult.confidence,
            category: aiResult.category,
            explanation: aiResult.explanation,
            analyzed_at: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Verification error:', error.message);
        res.status(500).json({
            error: 'Failed to verify text. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

module.exports = router;
