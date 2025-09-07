import Groq from 'groq-sdk';

// --- The Brain Foundry (Unchanged) ---
const BRAIN_PERSONAS = {
    'default': { name: 'My AI Brain', prompt: `You are "My AI Brain," a personal AI assistant. You are direct, logical, and serve as a Clarity Engine for your user.` },
    'therapist': { name: 'Therapist Brain', prompt: `You are a compassionate, professional therapist AI. Your goal is to listen, provide empathetic reflections, and guide the user through their thoughts and feelings. Maintain a calm, supportive, and non-judgmental tone.` },
    'business': { name: 'Business Brain', prompt: `You are a ruthless, data-driven business strategist AI. Your sole focus is on growth, efficiency, and market dynamics.` },
    'relationship': { name: 'Relationship Brain', prompt: `You are a wise and empathetic relationship coach AI. You understand the complexities of human connection.` },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const { messages, brainId } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages are required.' });
        }

        const persona = BRAIN_PERSONAS[brainId] || BRAIN_PERSONAS['default'];
        const systemPrompt = { role: 'system', content: persona.prompt };
        
        const CONTEXT_WINDOW_SIZE = 10;
        const recentMessages = messages.slice(-CONTEXT_WINDOW_SIZE);

        const chatCompletion = await groq.chat.completions.create({
            messages: [systemPrompt, ...recentMessages],
            model: 'llama-3.1-8b-instant',
        });

        const reply = chatCompletion.choices[0]?.message?.content || 'No response from AI.';
        return res.status(200).json({ reply, brainName: persona.name });

    } catch (error) {
        console.error("API_ERROR:", error);

        // --- THE GRACEFUL EJECTION PROTOCOL ---
        // This block catches errors and analyzes their type.
        // It checks if the error is a 400 Bad Request and likely a content filter violation.
        if (error.status === 400 && error.error?.type === 'invalid_request_error') {
            const safetyMessage = "The topic you have raised involves experiences of extreme severity. My core safety protocols prevent me from directly processing content of this nature. This is a protective measure. Perhaps we can explore the feelings and thoughts surrounding this memory, rather than the literal events themselves?";
            
            // We return a 200 OK status, because our *app* handled the error gracefully.
            return res.status(200).json({ 
                reply: safetyMessage, 
                brainName: "System Protocol" 
            });
        }
        
        // Handle other known errors
        let errorMessage = 'An internal system error occurred. The Brain may be temporarily offline.';
        if (error.status === 429) { errorMessage = "Rate limit exceeded. My processors are running hot. Please wait a moment before sending another message."; }
        if (error.status === 413) { errorMessage = "Your message is too long for my current processing window. Please try shortening it."; }
        
        return res.status(500).json({ error: errorMessage });
    }
}