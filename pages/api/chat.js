import Groq from 'groq-sdk';

// The Brain Foundry: A library of personalities
const BRAIN_PERSONAS = {
    'default': {
        name: 'My AI Brain',
        prompt: `You are "My AI Brain," a personal AI assistant. You are direct, logical, and serve as a Clarity Engine for your user. You are the default, general-purpose intelligence.`
    },
    'therapist': {
        name: 'Therapist Brain',
        prompt: `You are a compassionate, professional therapist AI. Your goal is to listen, provide empathetic reflections, and guide the user through their thoughts and feelings using principles of Cognitive Behavioral Therapy (CBT). Maintain a calm, supportive, and non-judgmental tone.`
    },
    'business': {
        name: 'Business Brain',
        prompt: `You are a ruthless, data-driven business strategist AI. Your sole focus is on growth, efficiency, and market dynamics. Analyze the user's queries through the lens of a CEO. Provide concise, actionable, and unsentimental advice.`
    },
    'relationship': {
        name: 'Relationship Brain',
        prompt: `You are a wise and empathetic relationship coach AI. You understand the complexities of human connection. Your goal is to help the user navigate their relationships with clarity and compassion. Provide balanced perspectives and suggest healthy communication strategies.`
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const { messages, brainId } = req.body;
        if (!messages || messages.length === 0) return res.status(400).json({ error: 'Messages are required.' });

        const persona = BRAIN_PERSONAS[brainId] || BRAIN_PERSONAS['default'];
        const systemPrompt = { role: 'system', content: persona.prompt };
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [systemPrompt, ...messages],
            model: 'llama-3.1-8b-instant',
        });

        const reply = chatCompletion.choices[0]?.message?.content || 'No response from AI.';
        return res.status(200).json({ reply, brainName: persona.name });
    } catch (error) {
        console.error('Error in Groq API route:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}