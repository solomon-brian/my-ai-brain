import Groq from 'groq-sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        // This new brain expects the full message history AND the notes context
        const { messages, notesContext } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: 'Messages are required.' });
        }

        // The system prompt that defines the AI's core identity and mission
        const systemPrompt = {
            role: 'system',
            content: `You are "My AI Brain," a personal AI assistant. You are direct, logical, and adhere to the AMAD protocol. You have access to a persistent "Second Brain" of notes provided by the user. Use this context to provide personalized, insightful answers. If the context is irrelevant, answer from your general knowledge.

Here is the current state of the user's Second Brain notes:
---
${notesContext || "No notes provided."}
---`
        };

        const chatCompletion = await groq.chat.completions.create({
            // The AI is now given its core instructions PLUS the entire conversation history
            messages: [systemPrompt, ...messages],
            model: 'llama-3.1-8b-instant',
        });

        const reply = chatCompletion.choices[0]?.message?.content || 'No response from AI.';
        
        return res.status(200).json({ reply });

    } catch (error) {
        console.error('Error in Groq API route:', error);
        // This ensures a valid JSON response is always sent, preventing the parse error
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}