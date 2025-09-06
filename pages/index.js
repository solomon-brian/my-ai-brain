import { useState, useEffect, useRef } from "react";

const BrainIcon = () => ( <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 13.5C4.01 13.5 2 15.51 2 18C2 19.82 3.08 21.4 4.7 22.21M17.5 13.5C19.99 13.5 22 15.51 22 18C22 19.82 20.92 21.4 19.3 22.21M12 13V22M12 13C13.66 13 15 11.66 15 10V9C15 6 12 3 12 3C12 3 9 6 9 9V10C9 11.66 10.34 13 12 13ZM12 3C10.5 1.5 8.5 2 7.5 4C6.5 6 8.5 7.5 9 9M12 3C13.5 1.5 15.5 2 16.5 4C17.5 6 15.5 7.5 15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const UserIcon = () => ( <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 12C18.6667 12 20 16 20 18V20H4V18C4 16 5.33333 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [messages, setMessages] = useState([]); // Separate state for chat
    const [input, setInput] useState("");
    const [mode, setMode] = useState("analysis"); // Default to the chat
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState("light");
    const messagesEndRef = useRef(null);

    // --- Core Logic ---
    useEffect(() => { /* theme logic */ }, []);
    const toggleTheme = () => { /* theme logic */ };
    useEffect(() => { /* load notes */ }, []);
    useEffect(() => { /* save notes */ }, [notes]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages]);

    const addNote = () => { if (!input.trim()) return; setNotes(prev => [...prev, { text: input, date: new Date().toISOString() }]); setInput(""); };
    
    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        const context = notes.map(n => n.text).join("\n");
        const prompt = `Context:\n${context}\n\nQuestion: ${input}`;
        
        try {
            const response = await fetch('/api/groq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
            if (!response.ok) throw new Error((await response.json()).error || "Server error");
            const data = await response.json();
            const aiMessage = { role: 'assistant', content: data.result };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- UI Structure ---
    return (
        <div className="flex flex-col h-screen font-sans antialiased">
            <header className="fixed top-0 left-0 right-0 z-10 backdrop-blur-sm" style={{ backgroundColor: 'var(--header-bg)' }}>
                <div className="w-full max-w-5xl mx-auto flex justify-between items-center p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                        <div className="text-blue-600"><BrainIcon /></div>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>My AI Brain</h1>
                    </div>
                    <nav className="flex items-center gap-2">
                        <button onClick={() => setMode('notes')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${mode === 'notes' ? 'bg-gray-200 dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400'}`}>Notes</button>
                        <button onClick={() => setMode('analysis')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${mode === 'analysis' ? 'bg-gray-200 dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400'}`}>Analysis</button>
                        <button className="px-3 py-2 rounded-lg text-sm font-semibold" style={{ color: 'var(--text-dim)', backgroundColor: 'var(--surface-bg)' }} onClick={toggleTheme}>{theme === 'light' ? 'Dark' : 'Light'}</button>
                    </nav>
                </div>
            </header>

            <main className="flex-1 pt-[81px] overflow-hidden">
                {/* Notes View */}
                <div className={`w-full h-full p-6 transition-transform duration-300 ease-in-out ${mode === 'notes' ? 'translate-x-0' : '-translate-x-full'}`}>
                    <h2 className="text-2xl font-bold mb-4">Notes Log</h2>
                    <textarea className="w-full h-40 p-3 rounded-lg border" style={{backgroundColor: 'var(--surface-bg)', borderColor: 'var(--border-color)'}} placeholder="Capture a new note..." value={input} onChange={e => setInput(e.target.value)}></textarea>
                    <button onClick={addNote} className="px-5 py-2 mt-2 rounded-lg bg-blue-600 text-white font-semibold">Save Note</button>
                    <div className="mt-6 space-y-2 overflow-y-auto h-[calc(100%-250px)]">
                        {notes.slice().reverse().map((n, i) => <div key={i} className="p-3 rounded-lg" style={{backgroundColor: 'var(--surface-bg)'}}>{n.text}</div>)}
                    </div>
                </div>

                {/* Analysis (Chat) View */}
                <div className={`w-full h-full p-6 transition-transform duration-300 ease-in-out absolute top-0 left-0 pt-[81px] ${mode === 'analysis' ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="max-w-3xl mx-auto h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto space-y-6 pr-4">
                            {messages.map((msg, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : ''}`} style={{backgroundColor: msg.role === 'assistant' ? 'var(--bot-bubble-bg)' : ''}}>
                                        {msg.role === 'user' ? <UserIcon /> : <BrainIcon />}
                                    </div>
                                    <div className="p-3 rounded-lg" style={{backgroundColor: msg.role === 'user' ? 'var(--user-bubble-bg)' : 'var(--bot-bubble-bg)', color: msg.role === 'user' ? '#fff' : 'var(--text-main)'}}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && <p>...</p>}
                            <div ref={messagesEndRef}></div>
                        </div>
                        <div className="py-4">
                            <div className="relative">
                                <textarea className="w-full p-4 pr-16 rounded-xl border" style={{backgroundColor: 'var(--surface-bg)', borderColor: 'var(--border-color)'}} placeholder="Ask your brain..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => {if(e.key === 'Enter' && !e.shiftKey) {e.preventDefault(); handleSendMessage();}}}></textarea>
                                <button onClick={handleSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 text-white">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}