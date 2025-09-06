import { useState, useEffect, useRef } from "react";

// --- SVG Icon Components ---
const SidebarToggleIcon = () => (<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>);
const NewChatIcon = () => (<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const HistoryIcon = () => (<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 3.36A9 9 0 0 0 20.49 15"/></svg>);
const SendIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/></svg>);
const UserIcon = () => ( <svg className="h-6 w-6 p-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 12C18.6667 12 20 16 20 18V20H4V18C4 16 5.33333 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const BrainIcon = () => ( <svg className="h-6 w-6 p-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 13.5C4.01 13.5 2 15.51 2 18C2 19.82 3.08 21.4 4.7 22.21M17.5 13.5C19.99 13.5 22 15.51 22 18C22 19.82 20.92 21.4 19.3 22.21M12 13V22M12 13C13.66 13 15 11.66 15 10V9C15 6 12 3 12 3C12 3 9 6 9 9V10C9 11.66 10.34 13 12 13ZM12 3C10.5 1.5 8.5 2 7.5 4C6.5 6 8.5 7.5 9 9M12 3C13.5 1.5 15.5 2 16.5 4C17.5 6 15.5 7.5 15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );

export default function Home() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleNewChat = () => {
        setMessages([]);
        setInput("");
    };

    const handleSendMessage = async (prompt = input) => {
        if (!prompt.trim() || isLoading) return;
        const newMessages = [...messages, { role: 'user', content: prompt }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);
        try {
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages, brainId: 'default' }) });
            if (!response.ok) throw new Error("Connection to the AI brain failed. The system may be offline.");
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
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
        <div className="flex h-screen bg-white text-black font-sans text-base overflow-hidden">
            <aside className={`bg-gray-100 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-72'} p-3`}>
                <div className="flex items-center justify-center h-10 mb-4">
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-gray-200 rounded-lg">
                        <SidebarToggleIcon/>
                    </button>
                </div>
                <div className="flex-1 space-y-2">
                    <button onClick={handleNewChat} className="w-full flex items-center p-3 rounded-lg hover:bg-gray-200 group">
                        <NewChatIcon/>
                        <span className={`ml-4 transition-opacity duration-200 whitespace-nowrap ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>New Chat</span>
                    </button>
                    <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-200 group">
                        <HistoryIcon/>
                        <span className={`ml-4 transition-opacity duration-200 whitespace-nowrap ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>History</span>
                    </button>
                </div>
                <div>
                    <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">AD</div>
                        <span className={`ml-4 font-semibold transition-opacity duration-200 whitespace-nowrap ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Alioski Doktori</span>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col">
                <header className="flex items-center justify-end p-4">
                    <button className="px-4 py-2 text-sm font-semibold bg-brand-purple text-white rounded-lg hover:opacity-90">Upgrade your plan</button>
                </header>

                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <h1 className="text-4xl font-bold mb-8">What can I help with?</h1>
                            <div className="relative w-full max-w-2xl">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">+</span>
                                <input type="text" onKeyPress={handleKeyPress} onChange={(e) => setInput(e.target.value)} value={input} className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple" placeholder="Ask anything"/>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 max-w-3xl mx-auto p-6">
                            {/* --- THE FIX IS HERE: Full JSX implementation --- */}
                            {messages.map((msg, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600">
                                        {msg.role === 'user' ? <UserIcon/> : <BrainIcon/>}
                                    </div>
                                    <div className="flex-1 pt-0.5">
                                        <p className="font-bold mb-1 text-gray-900">{msg.role === 'user' ? 'You' : 'My AI Brain'}</p>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600">
                                        <BrainIcon/>
                                    </div>
                                    <div className="flex-1 pt-0.5">
                                        <p className="font-bold mb-1 text-gray-900">My AI Brain</p>
                                        <p className="animate-pulse text-gray-500">...</p>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {messages.length > 0 && (
                     <footer className="p-4">
                        <div className="relative max-w-3xl mx-auto">
                            <textarea className="w-full p-4 pr-16 rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-purple resize-none" rows="1" placeholder="Ask anything..." value={input} onChange={(e)=>{setInput(e.target.value); e.target.style.height='auto'; e.target.style.height=`${e.target.scrollHeight}px`;}} onKeyPress={handleKeyPress}/>
                            <button onClick={() => handleSendMessage(input)} disabled={!input.trim() || isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black hover:bg-gray-800 disabled:bg-gray-400 transition-colors"><SendIcon/></button>
                        </div>
                    </footer>
                )}

                <div className="p-4">
                     <div className="max-w-3xl mx-auto p-4 bg-gray-800 text-white rounded-lg flex justify-between items-center">
                         <div>
                             <p className="font-bold">Unlock more with Plus</p>
                             <p className="text-sm text-gray-300">Get higher limits, smarter models, and more.</p>
                         </div>
                         <button className="bg-black px-4 py-2 rounded-lg font-semibold">Upgrade</button>
                     </div>
                </div>
            </main>
        </div>
    );
}