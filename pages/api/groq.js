import Groq from 'groq-sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { 
                    role: 'system', 
                    content: 'You are "My AI Brain," a personal analysis engine. You will be given a user\'s notes as context and a question. Your task is to synthesize the information in the context to provide a clear, logical, and insightful answer to the question. Be direct and analytical. If the context does not contain enough information to answer, state that clearly.'
                },
                { 
                    role: 'user', 
                    content: prompt 
                }
            ],
            // --- FINAL ADAPTATION ---
            // The logs confirm a mass-deprecation event by Groq.
            // We are aligning with their new, documented, and stable model series.
            // This is the ground truth.
            // --------------------------
            model: 'llama-3.1-8b-instant',
        });

        const result = chatCompletion.choices[0]?.message?.content || 'No response from AI.';
        return res.status(200).json({ result });

    } catch (error) {
        console.error('Error in Groq API route:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}