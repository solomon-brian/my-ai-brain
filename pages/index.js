import { useState, useEffect, useRef } from "react";

// --- Components & Data ---
const BrainIcon = () => (/* ... svg ... */);
const UserIcon = () => (/* ... svg ... */);
const NewChatIcon = () => (/* ... svg ... */);

const BRAINS = [
    { id: 'default', name: 'My AI Brain', description: 'The default Clarity Engine.' },
    { id: 'therapist', name: 'Therapist Brain', description: 'Empathetic guidance and reflection.' },
    { id: 'business', name: 'Business Brain', description: 'Ruthless strategic analysis.' },
    { id: 'relationship', name: 'Relationship Brain', description: 'Navigate human connections.' },
];

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeBrain, setActiveBrain] = useState('default'); // Track the current brain
    const [currentBrainName, setCurrentBrainName] = useState('My AI Brain');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        handleNewChat(); // Start with a fresh chat
    }, [activeBrain]); // Start a new chat whenever the brain is switched

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages]);

    const handleNewChat = () => {
        const brainName = BRAINS.find(b => b.id === activeBrain)?.name || 'My AI Brain';
        setCurrentBrainName(brainName);
        setMessages([{ role: 'assistant', content: `Initializing ${brainName}. System Online.` }]);
    };
    
    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;
        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/chat', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ messages: newMessages, brainId: activeBrain }) 
            });
            if (!response.ok) throw new Error((await response.json()).error || "Server error");
            const data = await response.json();
            const aiMessage = { role: 'assistant', content: data.reply, brainName: data.brainName };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex h-screen bg-black text-white font-sans text-sm">
            {/* Sidebar */}
            <aside className="w-72 bg-black p-4 flex flex-col space-y-4">
                <button onClick={handleNewChat} className="w-full text-left p-3 mb-2 rounded-lg border border-gray-700 hover:bg-gray-800 flex items-center gap-3 transition-colors">
                    <NewChatIcon/> New Chat
                </button>
                
                {/* Brains Section */}
                <div>
                    <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Brains</h2>
                    <div className="space-y-1">
                        {BRAINS.map(brain => (
                            <button key={brain.id} onClick={() => setActiveBrain(brain.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${activeBrain === brain.id ? 'bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}>
                                <p className="font-semibold text-white">{brain.name}</p>
                                <p className="text-xs text-gray-500">{brain.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1"></div> {/* Spacer */}

                <div className="border-t border-gray-800 pt-4">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">AD</div>
                        <span className="font-semibold">Alioski Doktori</span>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col bg-gray-900">
                <header className="p-4 text-center border-b border-gray-800">
                    <h2 className="font-semibold text-lg">{currentBrainName}</h2>
                </header>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-8 max-w-3xl mx-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                    {msg.role === 'user' ? <UserIcon/> : <BrainIcon/>}
                                </div>
                                <div className="flex-1 pt-0.5">
                                    <p className="font-bold mb-1 text-gray-200">{msg.role === 'user' ? 'You' : (msg.brainName || currentBrainName)}</p>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {/* ... loading indicator and messagesEndRef ... */}
                    </div>
                </div>

                <footer className="p-6 bg-gray-900">
                     {/* ... input form ... */}
                </footer>
            </main>
        </div>
    );
}