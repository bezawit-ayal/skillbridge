const axios = require('axios');

async function generateChatReply(prompt) {
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
        return {
            reply: 'I am in fallback mode right now. Try asking about a programming concept, a course topic, or a coding problem and I will provide a study-focused answer.',
            source: 'fallback',
        };
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an educational AI assistant for a technology learning platform. Provide clear, motivating, beginner-friendly answers focused on learning and coding.',
                    },
                    { role: 'user', content: prompt },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            reply: response.data.choices?.[0]?.message?.content || 'I could not generate a response right now.',
            source: 'ai',
        };
    } catch (error) {
        return {
            reply: 'The AI assistant is temporarily unavailable. You can still continue learning with your course materials and practice tasks.',
            source: 'fallback',
        };
    }
}

module.exports = { generateChatReply };
