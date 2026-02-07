const axios = require('axios');

/**
 * Call Gemini API for misinformation detection
 */
const callGeminiAPI = async (text) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey.includes('your_gemini')) {
            throw new Error('Gemini API key not configured');
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `You are an expert fact-checker. Analyze the following text for misinformation, false claims, or misleading information.

Respond ONLY with valid JSON in this exact format:
{
  "is_misinformation": boolean,
  "confidence": number between 0 and 1,
  "category": "politics" | "health" | "science" | "climate" | "technology" | "finance" | "entertainment" | "general",
  "explanation": "Brief explanation of your verdict"
}

Text to analyze: "${text.replace(/"/g, '\\"')}"`,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 500,
                },
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 15000,
            }
        );

        const content = response.data.candidates[0].content.parts[0].text;

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);

            // Validate and normalize result
            return {
                is_misinformation: Boolean(result.is_misinformation),
                confidence: Math.min(Math.max(Number(result.confidence) || 0.5, 0), 1),
                category: result.category || 'general',
                explanation: result.explanation || 'Analysis completed',
            };
        }

        throw new Error('Invalid JSON response from Gemini');
    } catch (error) {
        console.error('❌ Gemini API error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Call Grok API for misinformation detection (optional fallback)
 */
const callGrokAPI = async (text) => {
    try {
        const apiKey = process.env.GROK_API_KEY;

        if (!apiKey || apiKey.includes('your_grok')) {
            throw new Error('Grok API key not configured');
        }

        // Placeholder for Grok API integration
        // Update with actual Grok API endpoint when available
        throw new Error('Grok API integration pending');
    } catch (error) {
        console.error('❌ Grok API error:', error.message);
        throw error;
    }
};

/**
 * Analyze text with fallback logic
 */
const analyzeText = async (text) => {
    // Try Gemini first
    try {
        return await callGeminiAPI(text);
    } catch (geminiError) {
        console.log('⚠️  Gemini failed, trying Grok...');

        // Try Grok as fallback
        try {
            return await callGrokAPI(text);
        } catch (grokError) {
            console.log('⚠️  Grok also failed, using fallback response');

            // Final fallback: return safe default
            return {
                is_misinformation: false,
                confidence: 0.0,
                category: 'unknown',
                explanation: 'Unable to analyze due to API errors. Please try again later.',
            };
        }
    }
};

module.exports = {
    callGeminiAPI,
    callGrokAPI,
    analyzeText,
};
