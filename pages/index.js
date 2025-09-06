import { useState, useEffect, useRef } from "react";

// --- SVG Icon Components (Full, correct code) ---
const MenuIcon = () => (<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const NewChatIcon = () => (<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const BrainsIcon = () => (<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h2M19 12h2M12 3v2M12 19v2M6.343 6.343l1.414 1.414M16.243 16.243l1.414 1.414M6.343 17.657l1.414-1.414M16.243 7.757l1.414-1.414M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></svg>);
const SendIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/></svg>);
const UserIcon = () => ( <svg className="h-6 w-6 p-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 12C18.6667 12 20 16 20 18V20H4V18C4 16 5.33333 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const BrainIconSmall = () => ( <svg className="h-6 w-6 p-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 13.5C4.01 13.5 2 15.51 2 18C2 19.82 3.08 21.4 4.7 22.21M17.5 13.5C19.99 13.5 22 15.51 22 18C22 19.82 20.92 21.4 19.3 22.21M12 13V22M12 13C13.66 13 15 11.66 15 10V9C15 6 12 3 12 3C12 3 9 6 9 9V10C9 11.66 10.34 13 12 13ZM12 3C10.5 1.5 8.5 2 7.5 4C6.5 6 8.5 7.5 9 9M12 3C13.5 1.5 15.5 2 16.5 4C17.5 6 15.5 7.5 15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );

const BRAINS = [
    { id: 'default', name: 'My AI Brain', description: 'The default Clarity Engine.' },
    { id: 'therapist', name: 'Therapist Brain', description: 'Empathetic guidance.' },
    { id: 'business', name: 'Business Brain', description: 'Strategic analysis.' },
    { id: 'relationship', name: 'Relationship Brain', description: 'Navigate connections.' },
];

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // New state for collapsed sidebar
    const [activeBrain, setActiveBrain] = useState('default');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        handleNewChat();
    }, [activeBrain]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleNewChat = () => {
        const brainName = BRAINS.find(b => b.id === activeBrain)?.name || 'My AI Brain';
        setMessages([{ role: 'assistant', content: `Initializing ${brainName}. System Online.` }]);
        setInput("");
        setIsSidebarOpen(false);
    };
    
    const handleSendMessage = async (prompt = input) => {
        if (!prompt.trim() || isLoading) return;
        const newMessages = [...messages, { role: 'user', content: prompt }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);
        try {
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages, brainId: activeBrain }) });
            if (!response.ok) throw new Error("Connection to the AI brain failed.");
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
        <div className="flex h-screen bg-white text-black font-sans text-base overflow-hidden">
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"></div>}
            
            <aside className={`absolute z-20 h-full bg-gray-100 flex flex-col transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'} ${!isSidebarOpen && (isSidebarCollapsed ? 'md:w-20' : 'md:w-72')}`}>
                 <div className="flex items-center justify-center h-10 my-3">
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-gray-200 rounded-lg">
                        <MenuIcon/>
                    </button>
                </div>
                <button onClick={handleNewChat} className="flex-shrink-0 w-full flex items-center p-3 rounded-lg hover:bg-gray-200 group mb-2">
                    <NewChatIcon/>
                    <span className={`ml-4 transition-opacity duration-200 whitespace-nowrap ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>New Chat</span>
                </button>
                
                <div className="flex-1 overflow-y-auto space-y-1">
                     <h2 className={`px-3 text-sm font-semibold text-gray-500 mb-2 transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Brains</h2>
                     {BRAINS.map(brain => (
                        <button key={brain.id} onClick={() => setActiveBrain(brain.id)} 
                        className={`w-full flex items-center p-3 rounded-lg group transition-colors ${activeBrain === brain.id ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
                            <BrainsIcon/>
                            <span className={`ml-4 transition-opacity duration-200 whitespace-nowrap ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>{brain.name}</span>
                        </button>
                     ))}
                </div>
                
                <div>
                    <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">AD</div>
                        <span className={`ml-4 font-semibold transition-opacity duration-200 whitespace-nowrap ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Alioski Doktori</span>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col">
                <header className="flex items-center p-4 h-[65px] border-b border-gray-200">
                    <button onClick={() => setIsSidebarOpen(true)} className="mr-4 md:hidden"><MenuIcon/></button>
                    <div className="flex items-center gap-2">
                        <BrainIconSmall />
                        <h2 className="font-semibold text-lg">{BRAINS.find(b => b.id === activeBrain)?.name}</h2>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    {/* ... Chat log and Empty State logic remains the same ... */}
                </div>
                
                <footer className="p-4">
                    <div className="relative max-w-3xl mx-auto">
                        <textarea className="w-full p-4 pr-16 rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-purple resize-none" rows="1" placeholder="Ask anything..." value={input} onChange={(e)=>{setInput(e.target.value); e.target.style.height='auto'; e.target.style.height=`${e.target.scrollHeight}px`;}} onKeyPress={handleKeyPress}/>
                        <button onClick={() => handleSendMessage(input)} disabled={!input.trim() || isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black hover:bg-gray-800 disabled:bg-gray-400 transition-colors"><SendIcon/></button>
                    </div>
                </footer>
            </main>
        </div>
    );
}