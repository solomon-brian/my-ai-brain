import { useState, useEffect, useRef } from "react";

// --- Components & Data (Unchanged) ---
const BRAINS = [ /* ... */ ];

export default function Home() {
    const [chats, setChats] = useState({});
    const [currentChatId, setCurrentChatId] = useState(null);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isBrainSelectorOpen, setIsBrainSelectorOpen] = useState(false); // New state for modal
    const messagesEndRef = useRef(null);

    // --- Core Logic (Re-engineered) ---
    useEffect(() => { /* Load chats from localStorage */ }, []);
    useEffect(() => { /* Save chats to localStorage */ }, [chats]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chats, currentChatId]);

    const handleNewChat = (brainId = 'default') => {
        const newChatId = `chat_${Date.now()}`;
        const brainName = BRAINS.find(b => b.id === brainId)?.name || 'My AI Brain';
        const newChat = {
            id: newChatId,
            title: brainName === 'My AI Brain' ? `Note - ${new Date().toLocaleTimeString()}` : `${brainName} Session`,
            brainId: brainId, // The brain is now a property of the chat
            messages: [{ role: 'assistant', content: `Initializing ${brainName}. System Online.` }]
        };
        setChats(prev => ({ [newChatId]: newChat, ...prev }));
        setCurrentChatId(newChatId);
        setIsSidebarOpen(false);
        setIsBrainSelectorOpen(false); // Close the modal
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
            const response = await fetch('/api/chat', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ messages: updatedMessages, brainId: currentChat.brainId }) // Send the correct brainId
            });
            if (!response.ok) throw new Error("Connection failed.");
            const data = await response.json();
            const aiMessage = { role: 'assistant', content: data.reply, brainName: data.brainName };
            setChats(prev => ({ ...prev, [currentChatId]: { ...prev[currentChatId], messages: [...updatedMessages, aiMessage] } }));
        } catch (error) {
            // ... error handling
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-black text-white font-sans text-sm relative">
            {/* Brain Selector Modal */}
            {isBrainSelectorOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-30 flex items-center justify-center" onClick={() => setIsBrainSelectorOpen(false)}>
                    <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4">Select a Brain</h2>
                        <div className="space-y-2">
                            {BRAINS.map(brain => (
                                <button key={brain.id} onClick={() => handleNewChat(brain.id)} className="w-full text-left p-3 rounded-lg hover:bg-gray-800">
                                    <p className="font-semibold text-white">{brain.name}</p>
                                    <p className="text-xs text-gray-400">{brain.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Sidebar */}
            <aside className={`...`}>
                {/* --- The New Chat button now opens the modal --- */}
                <button onClick={() => setIsBrainSelectorOpen(true)} className="...">
                    <NewChatIcon/> New Chat
                </button>
                {/* ... rest of sidebar, now just lists chats ... */}
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-gray-900">
                <header className="p-4 text-center border-b border-gray-800">
                    {/* The header now shows the title of the CURRENT chat */}
                    <h2 className="font-semibold text-lg">{currentChatId ? chats[currentChatId]?.title : 'My AI Brain'}</h2>
                </header>
                {/* ... rest of main content ... */}
            </main>
        </div>
    );
}