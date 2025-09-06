import { useState, useEffect, useRef } from "react";

// --- SVG Icon Components (Sized and styled for the new UI) ---
const BrainIcon = () => ( <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 13.5C4.01 13.5 2 15.51 2 18C2 19.82 3.08 21.4 4.7 22.21M17.5 13.5C19.99 13.5 22 15.51 22 18C22 19.82 20.92 21.4 19.3 22.21M12 13V22M12 13C13.66 13 15 11.66 15 10V9C15 6 12 3 12 3C12 3 9 6 9 9V10C9 11.66 10.34 13 12 13ZM12 3C10.5 1.5 8.5 2 7.5 4C6.5 6 8.5 7.5 9 9M12 3C13.5 1.5 15.5 2 16.5 4C17.5 6 15.5 7.5 15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const UserIcon = () => ( <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 12C18.6667 12 20 16 20 18V20H4V18C4 16 5.33333 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const NewNoteIcon = () => (<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);

export default function Home() {
    const [chats, setChats] = useState({});
    const [currentChatId, setCurrentChatId] = useState(null);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // --- Core Logic (Unchanged) ---
    useEffect(() => {
        const savedChats = JSON.parse(localStorage.getItem("myaibrain_chats") || "{}");
        setChats(savedChats);
        const chatIds = Object.keys(savedChats);
        if (chatIds.length > 0) {
            setCurrentChatId(chatIds[0]);
        } else {
            handleNewChat();
        }
    }, []);

    useEffect(() => {
        if (Object.keys(chats).length > 0) {
            localStorage.setItem("myaibrain_chats", JSON.stringify(chats));
        }
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats, currentChatId]);

    const handleNewChat = () => {
        const newChatId = `chat_${Date.now()}`;
        const newChat = {
            id: newChatId,
            title: `Note - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            messages: [{ role: 'assistant', content: 'System Online. How can I help you process reality today?' }]
        };
        setChats(prev => ({ [newChatId]: newChat, ...prev }));
        setCurrentChatId(newChatId);
    };

    const handleSendMessage = async () => { /* ... Unchanged ... */ };
    const handleKeyPress = (e) => { /* ... Unchanged ... */ };

    const currentMessages = currentChatId ? chats[currentChatId]?.messages : [];

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans text-base">
            {/* Sidebar: Deep black, professional, and clean, as specified. */}
            <aside className="w-64 bg-black p-4 flex flex-col space-y-4">
                <button onClick={handleNewChat} className="w-full text-left p-3 rounded-lg border border-gray-700 hover:bg-gray-800 flex items-center gap-3 transition-colors">
                    <NewNoteIcon /> New Note
                </button>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {Object.values(chats).map(chat => (
                        <div key={chat.id} onClick={() => setCurrentChatId(chat.id)}
                            className={`p-3 text-gray-300 rounded-lg truncate cursor-pointer transition-colors ${currentChatId === chat.id ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
                            {chat.title}
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-800 pt-4">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">AD</div>
                        <span className="font-semibold">Alioski Doktori</span>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area: A rich dark gray for focus. */}
            <main className="flex-1 flex flex-col bg-gray-900">
                <header className="p-4 text-center border-b border-gray-800">
                    <h2 className="font-semibold text-lg">My AI Brain</h2>
                </header>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-8 max-w-3xl mx-auto">
                        {currentMessages.map((msg, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                    {msg.role === 'user' ? <UserIcon/> : <BrainIcon/>}
                                </div>
                                <div className="flex-1 pt-0.5">
                                    <p className="font-bold mb-1 text-gray-200">{msg.role === 'user' ? 'You' : 'My AI Brain'}</p>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700"><BrainIcon /></div>
                                <div className="flex-1 pt-0.5">
                                    <p className="font-bold mb-1 text-gray-200">My AI Brain</p>
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
                            placeholder="Ask your brain, or log a new note..."
                            rows="1"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 transition-colors">
                           <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/></svg>
                        </button>
                    </div>
                    <p className="text-center text-xs text-gray-600 mt-3">My AI Brain can make mistakes. Consider checking important information.</p>
                </footer>
            </main>
        </div>
    );
}