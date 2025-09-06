import Groq from 'groq-sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const { messages } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: 'Messages are required.' });
        }

        const systemPrompt = {
            role: 'system',
            content: `You are "My AI Brain," a personal AI assistant. You are direct, logical, and serve as a Clarity Engine for your user.`
        };

        const chatCompletion = await groq.chat.completions.create({
            messages: [systemPrompt, ...messages],
            model: 'llama-3.1-8b-instant',
        });

        const reply = chatCompletion.choices[0]?.message?.content || 'No response from AI.';
        return res.status(200).json({ reply });

    } catch (error) {
        console.error('Error in Groq API route:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}