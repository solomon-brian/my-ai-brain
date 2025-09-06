import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- SVG Icon Components ---
const BrainIcon = ({className}) => (<svg className={className || "h-6 w-6"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 13.5C4.01 13.5 2 15.51 2 18C2 19.82 3.08 21.4 4.7 22.21M17.5 13.5C19.99 13.5 22 15.51 22 18C22 19.82 20.92 21.4 19.3 22.21M12 13V22M12 13C13.66 13 15 11.66 15 10V9C15 6 12 3 12 3C12 3 9 6 9 9V10C9 11.66 10.34 13 12 13ZM12 3C10.5 1.5 8.5 2 7.5 4C6.5 6 8.5 7.5 9 9M12 3C13.5 1.5 15.5 2 16.5 4C17.5 6 15.5 7.5 15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const UserIcon = () => ( <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 12C18.6667 12 20 16 20 18V20H4V18C4 16 5.33333 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const SendIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/></svg>);

// --- Component Data ---
const BRAINS = [
    { id: 'default', name: 'My AI Brain', color: 'accent-default', description: 'The default Clarity Engine.' },
    { id: 'therapist', name: 'Therapist Brain', color: 'accent-therapist', description: 'Empathetic guidance & reflection.' },
    { id: 'business', name: 'Business Brain', color: 'accent-business', description: 'Ruthless strategic analysis.' },
    { id: 'relationship', name: 'Relationship Brain', color: 'accent-relationship', description: 'Navigate human connections.' },
];

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeBrain, setActiveBrain] = useState('default');
    const messagesEndRef = useRef(null);
    const activeColor = BRAINS.find(b => b.id === activeBrain)?.color || 'accent-default';

    useEffect(() => { handleNewChat(); }, [activeBrain]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleNewChat = () => {
        const brainName = BRAINS.find(b => b.id === activeBrain)?.name;
        setMessages([{ role: 'assistant', content: `Initializing ${brainName}. System Online.` }]);
    };
    
    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;
        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);
        try {
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages, brainId: activeBrain }) });
            if (!response.ok) throw new Error("Connection failed.");
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply, brainName: data.brainName }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e) => { 
        if (e.key === 'Enter' && !e.shiftKey) { 
            e.preventDefault(); 
            handleSendMessage(); 
        } 
    };

    return (
        <div className="h-screen w-screen flex flex-col relative font-sans text-white">
            <div className="sentient-background"></div>
            
            <header className={`flex-shrink-0 flex items-center justify-center p-4 border-b border-${activeColor}`} style={{ borderColor: `var(--tw-prognroll-${activeColor})`, backgroundColor: 'rgba(10, 10, 10, 0.5)', backdropFilter: 'blur(8px)' }}>
                <div className="flex items-center gap-2">
                    <BrainIcon className={`h-6 w-6 text-${activeColor}`} />
                    <h1 className="text-xl font-bold">My AI Brain</h1>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                <aside className="w-72 bg-core-dark bg-opacity-50 backdrop-blur-xl p-4 flex flex-col space-y-4 border-r border-border-dark">
                    <h2 className="text-sm font-semibold text-text-dim uppercase tracking-wider px-3">Cognitive Cores</h2>
                    <div className="space-y-1">
                        {BRAINS.map(brain => (
                            <button key={brain.id} onClick={() => setActiveBrain(brain.id)}
                                className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${activeBrain === brain.id ? `bg-${brain.color} bg-opacity-20 text-${brain.color} font-semibold` : 'text-text-dim hover:bg-surface-dark'}`}>
                                {brain.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 border-t border-border-dark mt-4 pt-4">
                        <h2 className="text-sm font-semibold text-text-dim uppercase tracking-wider px-3">Memory Stream</h2>
                    </div>
                </aside>

                <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                        {messages.length <= 1 ? (
                            <motion.div 
                                key="empty-state"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="flex flex-col items-center justify-center h-full text-center p-6"
                            >
                                <motion.div 
                                    className={`w-24 h-24 flex items-center justify-center rounded-full bg-surface-dark border border-border-dark shadow-2xl mb-8 shadow-${activeColor}`}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <BrainIcon className={`h-12 w-12 text-${activeColor}`} />
                                </motion.div>
                                <h1 className="text-4xl font-bold mb-2 text-text-bright">Welcome to your Brain Engine.</h1>
                                <p className="text-lg text-text-dim">Select a Cognitive Core and begin processing reality.</p>
                            </motion.div>
                        ) : (
                            <div className="space-y-8 max-w-3xl mx-auto p-6">
                                {messages.slice(1).map((msg, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-surface-dark">
                                            {msg.role === 'user' ? <UserIcon/> : <BrainIcon className="h-5 w-5"/>}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold mb-1 text-text-bright">{msg.role === 'user' ? 'Me' : (msg.brainName || 'My AI Brain')}</p>
                                            <p className="text-text-dim leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                     <div className="flex items-start gap-4 animate-fadeIn">
                                        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-surface-dark">
                                            <BrainIcon className="h-5 w-5"/>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold mb-1 text-text-bright">{BRAINS.find(b => b.id === activeBrain)?.name}</p>
                                            <p className="text-text-dim leading-relaxed animate-pulse">Thinking...</p>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    <footer className="p-6">
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`relative max-w-3xl mx-auto bg-surface-dark border border-border-dark rounded-xl shadow-lg focus-within:ring-2 ring-${activeColor}`}
                        >
                            <textarea
                                className="w-full p-4 pr-16 bg-transparent text-text-bright focus:outline-none resize-none"
                                placeholder={`Message your ${BRAINS.find(b => b.id === activeBrain)?.name}...`}
                                rows="1" value={input}
                                onChange={(e) => { setInput(e.target.value); e.target.style.height='auto'; e.target.style.height=`${e.target.scrollHeight}px`; }}
                                onKeyPress={handleKeyPress}
                            />
                            <button onClick={handleSendMessage} disabled={!input.trim() || isLoading} className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-${activeColor} text-white hover:opacity-90 disabled:bg-gray-600 transition-opacity`}>
                                <SendIcon/>
                            </button>
                        </motion.div>
                    </footer>
                </div>
            </main>
        </div>
    );
}