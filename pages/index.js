import { useState, useEffect, useRef } from "react";

const BrainIcon = () => ( <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 13.5C4.01 13.5 2 15.51 2 18C2 19.82 3.08 21.4 4.7 22.21M17.5 13.5C19.99 13.5 22 15.51 22 18C22 19.82 20.92 21.4 19.3 22.21M12 13V22M12 13C13.66 13 15 11.66 15 10V9C15 6 12 3 12 3C12 3 9 6 9 9V10C9 11.66 10.34 13 12 13ZM12 3C10.5 1.5 8.5 2 7.5 4C6.5 6 8.5 7.5 9 9M12 3C13.5 1.5 15.5 2 16.5 4C17.5 6 15.5 7.5 15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const UserIcon = () => ( <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 12C18.6667 12 20 16 20 18V20H4V18C4 16 5.33333 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState("light");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem("myaibrain_theme") || "light";
        setTheme(savedTheme);
        document.body.classList.toggle("dark-mode", savedTheme === "dark");
        setMessages([{ role: 'assistant', content: 'System Online. Welcome to your AI Brain.' }]);
    }, []);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("myaibrain_theme", newTheme);
        document.body.classList.toggle("dark-mode", newTheme === "dark");
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
                body: JSON.stringify({ messages: newMessages }) 
            });
            if (!response.ok) throw new Error((await response.json()).error || "Server error");
            const data = await response.json();
            const aiMessage = { role: 'assistant', content: data.reply };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen font-sans antialiased">
            <header className="fixed top-0 left-0 right-0 z-10 backdrop-blur-sm" style={{ backgroundColor: 'var(--header-bg)' }}>
                <div className="w-full max-w-5xl mx-auto flex justify-between items-center p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                        <div className="text-blue-600"><BrainIcon /></div>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>My AI Brain</h1>
                    </div>
                    <nav>
                        <button className="px-3 py-2 rounded-lg text-sm font-semibold" style={{ color: 'var(--text-dim)', backgroundColor: 'var(--surface-bg)' }} onClick={toggleTheme}>
                            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                        </button>
                    </nav>
                </div>
            </header>

            <main className="flex-1 pt-[81px] flex flex-col">
                 <div className="flex-1 overflow-y-auto space-y-6 p-6">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex items-start gap-4 max-w-3xl mx-auto`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center`} style={{backgroundColor: msg.role === 'user' ? 'var(--user-bubble-bg)' : 'var(--bot-bubble-bg)'}}>
                                {msg.role === 'user' ? <UserIcon /> : <BrainIcon />}
                            </div>
                            <div className="p-3 rounded-lg" style={{backgroundColor: msg.role === 'user' ? 'var(--user-bubble-bg)' : 'var(--bot-bubble-bg)', color: msg.role === 'user' ? '#fff' : 'var(--text-main)'}}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && <p className="text-center" style={{color: 'var(--text-dim)'}}>...</p>}
                    <div ref={messagesEndRef}></div>
                </div>
                <div className="py-4 px-6">
                    <div className="relative max-w-3xl mx-auto">
                        <textarea className="w-full p-4 pr-16 rounded-xl border" style={{backgroundColor: 'var(--surface-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)'}} placeholder="Ask your brain..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => {if(e.key === 'Enter' && !e.shiftKey) {e.preventDefault(); handleSendMessage();}}}></textarea>
                        <button onClick={handleSendMessage} disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-400">Send</button>
                    </div>
                </div>
            </main>
        </div>
    );
}