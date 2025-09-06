import { useState, useEffect, useRef } from "react";

// --- SVG Icon Components (Full, correct definitions) ---
const BrainIcon = () => ( <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 13.5C4.01 13.5 2 15.51 2 18C2 19.82 3.08 21.4 4.7 22.21M17.5 13.5C19.99 13.5 22 15.51 22 18C22 19.82 20.92 21.4 19.3 22.21M12 13V22M12 13C13.66 13 15 11.66 15 10V9C15 6 12 3 12 3C12 3 9 6 9 9V10C9 11.66 10.34 13 12 13ZM12 3C10.5 1.5 8.5 2 7.5 4C6.5 6 8.5 7.5 9 9M12 3C13.5 1.5 15.5 2 16.5 4C17.5 6 15.5 7.5 15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const UserIcon = () => ( <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 12C18.6667 12 20 16 20 18V20H4V18C4 16 5.33333 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const NewChatIcon = () => (<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);

// --- Component Data ---
const BRAINS = [
    { id: 'default', name: 'My AI Brain', description: 'The default Clarity Engine.' },
    { id: 'therapist', name: 'Therapist Brain', description: 'Empathetic guidance and reflection.' },
    { id: 'business', name: 'Business Brain', description: 'Ruthless strategic analysis.' },
    { id: 'relationship', name: 'Relationship Brain', description: 'Navigate human connections.' },
];

export default function Home() {
    const [chats, setChats] = useState({});
    const [currentChatId, setCurrentChatId] = useState(null);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isBrainSelectorOpen, setIsBrainSelectorOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const savedChats = JSON.parse(localStorage.getItem("myaibrain_chats") || "{}");
        const chatIds = Object.keys(savedChats);
        if (chatIds.length > 0) {
            setChats(savedChats);
            setCurrentChatId(chatIds[0]); // Select the most recent chat
        } else {
            handleNewChat('default'); // Start with a default brain chat
        }
    }, []);

    useEffect(() => {
        if (Object.keys(chats).length > 0) {
            localStorage.setItem("myaibrain_chats", JSON.stringify(chats));
        }
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats, currentChatId]);

    const handleNewChat = (brainId = 'default') => {
        const newChatId = `chat_${Date.now()}`;
        const brain = BRAINS.find(b => b.id === brainId) || BRAINS[0];
        const newChat = {
            id: newChatId,
            title: brain.id === 'default' ? `Note - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : `${brain.name} Session`,
            brainId: brainId,
            messages: [{ role: 'assistant', content: `Initializing ${brain.name}. System Online.` }]
        };
        setChats(prev => ({ [newChatId]: newChat, ...prev }));
        setCurrentChatId(newChatId);
        setIsSidebarOpen(false);
        setIsBrainSelectorOpen(false);
    };
    
    const handleSendMessage = async () => {
        if (!input.trim() || isLoading || !currentChatId) return;
        const currentChat = chats[currentChatId];
        const userMessage = { role: 'user', content: input };
        const updatedMessages = [...currentChat.messages, userMessage];
        setChats(prev => ({ ...prev, [currentChatId]: { ...currentChat, messages: updatedMessages } }));
        setInput("");
        setIsLoading(true);
        try {
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: updatedMessages, brainId: currentChat.brainId }) });
            if (!response.ok) throw new Error("Connection failed.");
            const data = await response.json();
            const aiMessage = { role: 'assistant', content: data.reply, brainName: data.brainName };
            setChats(prev => ({ ...prev, [currentChatId]: { ...prev[currentChatId], messages: [...updatedMessages, aiMessage] } }));
        } catch (error) {
            const errorMessage = { role: 'assistant', content: `Error: ${error.message}` };
            setChats(prev => ({ ...prev, [currentChatId]: { ...prev[currentChatId], messages: [...updatedMessages, errorMessage] } }));
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

    const currentMessages = currentChatId ? chats[currentChatId]?.messages : [];
    const currentChatTitle = currentChatId ? chats[currentChatId]?.title : 'My AI Brain';

    return (
        <div className="flex h-screen bg-black text-white font-sans text-sm relative">
            {isBrainSelectorOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-30 flex items-center justify-center" onClick={() => setIsBrainSelectorOpen(false)}>
                    <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4">Select a Brain</h2>
                        <div className="space-y-2">
                            {BRAINS.map(brain => (
                                <button key={brain.id} onClick={() => handleNewChat(brain.id)} className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors">
                                    <p className="font-semibold text-white">{brain.name}</p>
                                    <p className="text-xs text-gray-400">{brain.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            <aside className="w-64 bg-black p-4 flex-col space-y-4 hidden md:flex">
                <button onClick={() => setIsBrainSelectorOpen(true)} className="w-full text-left p-3 mb-2 rounded-lg border border-gray-700 hover:bg-gray-800 flex items-center gap-3 transition-colors">
                    <NewChatIcon/> New Chat
                </button>
                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                    {Object.values(chats).map(chat => (
                        <div key={chat.id} onClick={() => setCurrentChatId(chat.id)} className={`p-2 text-gray-300 rounded truncate cursor-pointer transition-colors ${currentChatId === chat.id ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
                            {chat.title}
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-800 pt-4">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">AD</div>
                        <span className="font-semibold">Alioski Doktori</span>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col bg-gray-900">
                <header className="p-4 text-center border-b border-gray-800">
                    <h2 className="font-semibold text-lg">{currentChatTitle}</h2>
                </header>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-8 max-w-3xl mx-auto">
                        {currentMessages.map((msg, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                    {msg.role === 'user' ? <UserIcon/> : <BrainIcon/>}
                                </div>
                                <div className="flex-1 pt-0.5">
                                    <p className="font-bold mb-1 text-gray-200">{msg.role === 'user' ? 'You' : (msg.brainName || 'My AI Brain')}</p>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700"><BrainIcon /></div>
                                <div className="flex-1 pt-0.5"><p className="font-bold mb-1 text-gray-200">{chats[currentChatId]?.brainId ? BRAINS.find(b=>b.id===chats[currentChatId].brainId)?.name : 'My AI Brain'}</p><p className="animate-pulse text-gray-400">...</p></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <footer className="p-6 bg-gray-900">
                    <div className="relative max-w-3xl mx-auto">
                        <textarea className="w-full p-4 pr-16 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" placeholder="Ask your brain..." rows="1" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}/>
                        <button onClick={handleSendMessage} disabled={!input.trim() || isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 transition-colors">
                           <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/></svg>
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    );
}