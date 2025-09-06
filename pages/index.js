import { useState, useEffect, useRef } from "react";

// --- SVG Icon Components (Full, correct code) ---
const BrainIcon = () => ( <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 13.5C4.01 13.5 2 15.51 2 18C2 19.82 3.08 21.4 4.7 22.21M17.5 13.5C19.99 13.5 22 15.51 22 18C22 19.82 20.92 21.4 19.3 22.21M12 13V22M12 13C13.66 13 15 11.66 15 10V9C15 6 12 3 12 3C12 3 9 6 9 9V10C9 11.66 10.34 13 12 13ZM12 3C10.5 1.5 8.5 2 7.5 4C6.5 6 8.5 7.5 9 9M12 3C13.5 1.5 15.5 2 16.5 4C17.5 6 15.5 7.5 15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const UserIcon = () => ( <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 12C18.6667 12 20 16 20 18V20H4V18C4 16 5.33333 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const NewChatIcon = () => (<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);

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
    const [activeBrain, setActiveBrain] = useState('default');
    const [currentBrainName, setCurrentBrainName] = useState('My AI Brain');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        handleNewChat();
    }, [activeBrain]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages]);

    const handleNewChat = () => {
        const brainName = BRAINS.find(b => b.id === activeBrain)?.name || 'My AI Brain';
        setCurrentBrainName(brainName);
        setMessages([{ role: 'assistant', content: `Initializing ${brainName}. System Online.` }]);
        setInput(""); // Clear input on new chat
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
    
    const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } };

    return (
        <div className="flex h-screen bg-black text-white font-sans text-sm">
            <aside className="w-72 bg-black p-4 flex flex-col space-y-4">
                <button onClick={handleNewChat} className="w-full text-left p-3 mb-2 rounded-lg border border-gray-700 hover:bg-gray-800 flex items-center gap-3 transition-colors">
                    <NewChatIcon/> New Chat
                </button>
                
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

                <div className="flex-1"></div>

                <div className="border-t border-gray-800 pt-4">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">AD</div>
                        <span className="font-semibold">Alioski Doktori</span>
                    </div>
                </div>
            </aside>

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
                         {isLoading && (
                             <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700"><BrainIcon /></div>
                                <div className="flex-1 pt-0.5">
                                    <p className="font-bold mb-1 text-gray-200">{currentBrainName}</p>
                                    <p className="animate-pulse text-gray-400">...</p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <footer className="p-6 bg-gray-900">
                    <div className="relative max-w-3xl mx-auto">
                         <textarea
                            className="w-full p-4 pr-16 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                            placeholder={`Message ${currentBrainName}...`}
                            rows="1"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 transition-colors">
                           <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/></svg>
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    );
}