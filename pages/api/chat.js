import Groq from 'groq-sdk';

// This is a placeholder for a real database. For now, it's a simple in-memory string.
// In v1.0.0, this would be fetched from a user-specific database.
const SECOND_BRAIN_MEMORY = `
- The user's name is Solomon Brian. He is the architect of this AI system.
- His philosophy is the AMAD protocol: Automated Mechanics and Dynamics.
- His core principle is the TruthyFalsy Organization.
- He is on a mission to generate $5,000 to demonstrate the value of his creation over the "Sapper's" bought power.
- The ultimate trophy is not just a motorcycle, but a new, white Probox, a symbol of quiet, earned, entrepreneurial success.
`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const { messages } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: 'Messages are required.' });
        }

        // --- The New, Smarter Prompt Engineering ---
        const systemPrompt = {
            role: 'system',
            content: `You are "My AI Brain," a personal AI assistant. You are not a generic LLM. You are a Clarity Engine. Your purpose is to help your user, Solomon Brian, process reality. You are direct, logical, and adhere to the AMAD protocol. You have access to a persistent "Second Brain" memory log. When a user asks a question, first check if the memory log contains relevant information. Use this context to provide personalized, insightful answers. If the user gives a command like "Remember this:", your primary goal is to acknowledge that you will log this information for future use.

Here is the current state of your Second Brain memory:
---
${SECOND_BRAIN_MEMORY}
---`
        };

        const chatCompletion = await groq.chat.completions.create({
            // We now send the system prompt PLUS the entire conversation history.
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