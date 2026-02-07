const { getDB } = require('./database');
const axios = require('axios');

/**
 * Find similar messages using AI semantic similarity
 */
const findSimilarMessages = async (text) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey.includes('your_gemini')) {
            return [];
        }

        const db = getDB();
        if (!db) return [];

        // Get recent messages (last 100) to compare against
        const recentMessages = await db.collection('misinformation')
            .find({})
            .sort({ timestamp: -1 })
            .limit(100)
            .toArray();

        if (recentMessages.length === 0) return [];

        // Build comparison text for Gemini
        const messagesForComparison = recentMessages.map((msg, idx) =>
            `${idx + 1}. "${msg.text}"`
        ).join('\n');

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
            {
                contents: [{
                    parts: [{
                        text: `Compare this new message with existing messages and find which ones convey the same core claim or misinformation (even if worded differently).

New message: "${text.replace(/"/g, '\\"')}"

Existing messages:
${messagesForComparison}

Return ONLY a JSON array of message numbers that say the SAME thing:
{"similar": [1, 3, 5]}

If no similar messages, return: {"similar": []}`
                    }]
                }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 100 }
            },
            { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
        );

        const content = response.data.candidates[0].content.parts[0].text;
        const jsonMatch = content.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            const similarIndices = result.similar || [];

            // Return the actual message objects
            return similarIndices.map(idx => recentMessages[idx - 1]).filter(Boolean);
        }

        return [];
    } catch (error) {
        console.error('⚠️  Similarity detection error:', error.message);
        return [];
    }
};

/**
 * Generate a common template for a group of similar messages
 */
const generateMessageTemplate = async (messages) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey.includes('your_gemini') || messages.length === 0) {
            return messages[0]?.text || '';
        }

        const messageTexts = messages.map((msg, idx) =>
            `${idx + 1}. "${msg.text || msg}"`
        ).join('\n');

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
            {
                contents: [{
                    parts: [{
                        text: `Given these variations of the same misinformation claim, generate a single concise template that captures the core claim.

Variations:
${messageTexts}

Return ONLY the template text (not JSON), using [brackets] for variable parts.
Example: "Donald Trump was the [45th/46th] president"`
                    }]
                }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 150 }
            },
            { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
        );

        const template = response.data.candidates[0].content.parts[0].text.trim();
        return template.replace(/^["']|["']$/g, ''); // Remove surrounding quotes
    } catch (error) {
        console.error('⚠️  Template generation error:', error.message);
        return messages[0]?.text || '';
    }
};

/**
 * Create or update a message cluster
 */
const updateMessageCluster = async (newMessageId, similarMessages) => {
    try {
        const db = getDB();
        if (!db || similarMessages.length === 0) return null;

        // Check if any similar message already has a cluster
        const existingCluster = similarMessages.find(msg => msg.clusterId);

        if (existingCluster) {
            // Add to existing cluster
            const clusterId = existingCluster.clusterId;

            // Update new message with cluster ID
            await db.collection('misinformation').updateOne(
                { _id: newMessageId },
                {
                    $set: {
                        clusterId,
                        isClusterHead: false
                    }
                }
            );

            // Increment variations count on cluster head
            await db.collection('misinformation').updateOne(
                { clusterId, isClusterHead: true },
                { $inc: { variations: 1 } }
            );

            return clusterId;
        } else {
            // Create new cluster
            const { ObjectId } = require('mongodb');
            const clusterId = new ObjectId().toString();

            // Get all messages for template
            const allMessages = [
                ...similarMessages,
                await db.collection('misinformation').findOne({ _id: newMessageId })
            ];

            // Generate template
            const template = await generateMessageTemplate(allMessages);

            // Mark first similar message as cluster head
            await db.collection('misinformation').updateOne(
                { _id: similarMessages[0]._id },
                {
                    $set: {
                        clusterId,
                        isClusterHead: true,
                        messageTemplate: template,
                        variations: similarMessages.length + 1
                    }
                }
            );

            // Update all other similar messages
            for (let i = 1; i < similarMessages.length; i++) {
                await db.collection('misinformation').updateOne(
                    { _id: similarMessages[i]._id },
                    {
                        $set: {
                            clusterId,
                            isClusterHead: false
                        }
                    }
                );
            }

            // Update new message
            await db.collection('misinformation').updateOne(
                { _id: newMessageId },
                {
                    $set: {
                        clusterId,
                        isClusterHead: false
                    }
                }
            );

            return clusterId;
        }
    } catch (error) {
        console.error('❌ Cluster update error:', error.message);
        return null;
    }
};

module.exports = {
    findSimilarMessages,
    generateMessageTemplate,
    updateMessageCluster
};
