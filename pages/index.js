import { useState, useEffect, useRef } from "react";

// --- SVG Icon Components ---
const MenuIcon = () => (<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const NewChatIcon = () => (<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const BrainsIcon = () => (<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h2M19 12h2M12 3v2M12 19v2M6.343 6.343l1.414 1.414M16.243 16.243l1.414 1.414M6.343 17.657l1.414-1.414M16.243 7.757l1.414-1.414M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></svg>);
const SendIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/></svg>);
const UserIcon = () => ( <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 12C18.6667 12 20 16 20 18V20H4V18C4 16 5.33333 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const BrainIconSmall = () => ( <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 13.5C4.01 13.5 2 15.51 2 18C2 19.82 3.08 21.4 4.7 22.21M17.5 13.5C19.99 13.5 22 15.51 22 18C22 19.82 20.92 21.4 19.3 22.21M12 13V22M12 13C13.66 13 15 11.66 15 10V9C15 6 12 3 12 3C12 3 9 6 9 9V10C9 11.66 10.34 13 12 13ZM12 3C10.5 1.5 8.5 2 7.5 4C6.5 6 8.5 7.5 9 9M12 3C13.5 1.5 15.5 2 16.5 4C17.5 6 15.5 7.5 15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => { handleNewChat(); }, []);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    
    const handleNewChat = () => {
        setMessages([]);
        setInput("");
        setSidebarOpen(false);
    };

    const handleSendMessage = async (prompt = input) => {
        if (!prompt.trim() || isLoading) return;
        const newMessages = [...messages, { role: 'user', content: prompt }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);
        try {
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages, brainId: 'default' }) });
            if (!response.ok) throw new Error("Failed to connect to the AI brain.");
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromptSuggestion = (text) => {
        handleSendMessage(text);
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans text-base overflow-hidden">
            <aside className={`absolute z-20 h-full bg-black p-4 flex flex-col space-y-4 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-72`}>
                <div className="flex justify-between items-center md:hidden">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <button onClick={() => setSidebarOpen(false)}>X</button>
                </div>
                <button onClick={handleNewChat} className="w-full text-left p-3 rounded-lg border border-gray-700 hover:bg-gray-800 flex items-center gap-3 transition-colors text-sm">
                    <NewChatIcon/> New Chat
                </button>
                <div className="flex-1 overflow-y-auto space-y-1">
                    <div className="p-3 text-gray-400 flex items-center gap-3 cursor-pointer hover:bg-gray-800 rounded-lg">
                        <BrainsIcon/> Brains
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-4">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">AD</div>
                        <span className="font-semibold">Alioski Doktori</span>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col bg-gray-900">
                <header className="flex items-center justify-between p-4 border-b border-gray-800">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden"><MenuIcon/></button>
                    <h2 className="font-semibold text-lg">My AI Brain</h2>
                    <div></div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <h1 className="text-3xl font-bold mb-6">What can I help with?</h1>
                            <div className="grid grid-cols-2 gap-4 max-w-md w-full">
                                <button onClick={() => handlePromptSuggestion('Summarize a complex text for me.')} className="p-4 bg-gray-800 rounded-lg text-left hover:bg-gray-700">
                                    <p className="font-semibold">Summarize text</p>
                                    <p className="text-xs text-gray-400">Distill the key points from any document.</p>
                                </button>
                                <button onClick={() => handlePromptSuggestion('Act as a business strategist.')} className="p-4 bg-gray-800 rounded-lg text-left hover:bg-gray-700">
                                    <p className="font-semibold">Business Strategy</p>
                                    <p className="text-xs text-gray-400">Analyze a market or a business model.</p>
                                </button>
                                <button onClick={() => handlePromptSuggestion('Help me write some code.')} className="p-4 bg-gray-800 rounded-lg text-left hover:bg-gray-700">
                                    <p className="font-semibold">Code</p>
                                    <p className="text-xs text-gray-400">Generate or debug code snippets.</p>
                                </button>
                                <button className="p-4 bg-gray-800 rounded-lg text-left hover:bg-gray-700">
                                    <p className="font-semibold">More</p>
                                    <p className="text-xs text-gray-400">Explore other capabilities.</p>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 max-w-3xl mx-auto p-6">
                            {messages.map((msg, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                        {msg.role === 'user' ? <UserIcon/> : <BrainIconSmall/>}
                                    </div>
                                    <div className="flex-1 pt-0.5">
                                        <p className="font-bold mb-1 text-gray-200">{msg.role === 'user' ? 'You' : 'My AI Brain'}</p>
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700"><BrainIconSmall /></div>
                                    <div className="flex-1 pt-0.5">
                                        <p className="font-bold mb-1 text-gray-200">My AI Brain</p>
                                        <p className="animate-pulse text-gray-400">...</p>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <footer className="p-4 bg-gray-900">
                    <div className="relative max-w-3xl mx-auto">
                        <textarea className="w-full p-4 pr-16 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" rows="1" placeholder="Ask anything..." value={input} onChange={(e)=>{setInput(e.target.value); e.target.style.height='auto'; e.target.style.height=`${e.target.scrollHeight}px`;}} onKeyPress={handleKeyPress}/>
                        <button onClick={() => handleSendMessage(input)} disabled={!input.trim() || isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 transition-colors"><SendIcon/></button>
                    </div>
                </footer>
            </main>
        </div>
    );
}