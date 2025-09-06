import { useState, useEffect, useRef } from "react";

const BrainIcon = () => (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.5 13.5C4.01 13.5 2 15.51 2 18C2 19.82 3.08 21.4 4.7 22.21M17.5 13.5C19.99 13.5 22 15.51 22 18C22 19.82 20.92 21.4 19.3 22.21M12 13V22M12 13C13.66 13 15 11.66 15 10V9C15 6 12 3 12 3C12 3 9 6 9 9V10C9 11.66 10.34 13 12 13ZM12 3C10.5 1.5 8.5 2 7.5 4C6.5 6 8.5 7.5 9 9M12 3C13.5 1.5 15.5 2 16.5 4C17.5 6 15.5 7.5 15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [input, setInput] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [mode, setMode] = useState("note");
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState("light");
    const [toast, setToast] = useState({ show: false, message: "" });

    useEffect(() => {
        const savedTheme = localStorage.getItem("myaibrain_theme") || "light";
        setTheme(savedTheme);
        document.body.classList.toggle("dark-mode", savedTheme === "dark");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("myaibrain_theme", newTheme);
        document.body.classList.toggle("dark-mode", newTheme === "dark");
    };

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("myaibrain_notes") || "[]");
            setNotes(saved);
        } catch (e) { setNotes([]); }
    }, []);

    useEffect(() => { localStorage.setItem("myaibrain_notes", JSON.stringify(notes)); }, [notes]);

    const showToast = (message) => {
        setToast({ show: true, message: "" });
        setTimeout(() => { setToast({ show: true, message }); }, 50);
        setTimeout(() => setToast({ show: false, message: "" }), 2050);
    };

    const deleteNote = (indexToDelete) => {
        const actualIndex = notes.length - 1 - indexToDelete;
        const updatedNotes = notes.filter((_, index) => index !== actualIndex);
        setNotes(updatedNotes);
        showToast("Note deleted.");
    };

    const addNote = () => {
        if (!input.trim()) return;
        setNotes([...notes, { text: input, date: new Date().toISOString() }]);
        setInput("");
        showToast("Note Captured.");
    };

    const clearNotes = () => { if (window.confirm("Are you sure?")) { setNotes([]); showToast("Log Cleared."); } };

    const copyToClipboard = () => {
        if (!aiResponse || aiResponse.startsWith("Analyzing...") || aiResponse.startsWith("Error:")) return;
        navigator.clipboard.writeText(aiResponse);
        showToast("Analysis copied to clipboard.");
    };
    
    const askAI = async () => {
        if (!input.trim() || isLoading) return;
        setIsLoading(true);
        setAiResponse("Analyzing...");
        const context = notes.map(n => n.text).join("\n");
        const prompt = `Context:\n${context}\n\nQuestion: ${input}`;
        try {
            const response = await fetch('/api/groq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
            if (!response.ok) throw new Error((await response.json()).error || "Server error");
            const data = await response.json();
            setAiResponse(data.result);
        } catch (error) {
            setAiResponse(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
            // We do NOT clear the input in AI mode.
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            mode === 'note' ? addNote() : askAI();
        }
    };

    return (
        <div className="flex flex-col h-screen font-sans antialiased" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-main)' }}>
            <header className="fixed top-0 left-0 right-0 z-10 backdrop-blur-sm" style={{ backgroundColor: 'var(--header-bg)' }}>
                 <div className="w-full max-w-4xl mx-auto flex justify-between items-center p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                        <div className="text-blue-600"><BrainIcon /></div>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>My AI Brain</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-3 py-1.5 rounded-lg text-sm font-semibold" style={{ color: 'var(--text-dim)', backgroundColor: 'var(--surface-bg)' }} onClick={toggleTheme}>
                            {theme === 'light' ? 'Dark' : 'Light'} Mode
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-[81px] overflow-hidden">
                <div className="w-full max-w-2xl mx-auto h-full flex flex-col">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-center gap-2 my-4">
                        <button className={`w-full py-2 rounded-md text-sm font-semibold ${mode === "note" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 dark:text-gray-400"}`} onClick={() => setMode("note")}>Notes</button>
                        <button className={`w-full py-2 rounded-md text-sm font-semibold ${mode === "ask" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 dark:text-gray-400"}`} onClick={() => setMode("ask")}>Analysis</button>
                    </div>
                    
                    <div className="flex-1 min-h-0 relative">
                        {/* Note View */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${mode === 'note' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <div className="flex justify-between items-center mb-2 px-1">
                                <h2 className="text-lg font-bold" style={{color: 'var(--text-main)'}}>Log</h2>
                                {notes.length > 0 && <button onClick={clearNotes} className="text-xs text-red-500 hover:underline font-semibold">Clear Log</button>}
                            </div>
                            <div className="h-[calc(100%-100px)] overflow-y-auto space-y-2 pr-2">
                                {notes.length > 0 ? notes.slice().reverse().map((n, i) => (
                                    <div key={i} className="group flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'var(--surface-bg)'}}>
                                        <p className="text-sm" style={{color: 'var(--text-dim)'}}>{n.text}</p>
                                        <button onClick={() => deleteNote(i)} className="opacity-0 group-hover:opacity-100 text-red-500 text-xs font-bold transition-opacity">X</button>
                                    </div>
                                )) : (
                                     <div className="text-center p-10" style={{color: 'var(--text-dim)'}}><p className="text-lg">Your brain is empty.</p><p className="text-sm">Start capturing thoughts.</p></div>
                                )}
                            </div>
                        </div>

                        {/* Analysis View */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${mode === 'ask' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                             <div className="flex justify-between items-center mb-2 px-1">
                                <h2 className="text-lg font-bold" style={{color: 'var(--text-main)'}}>AI Response</h2>
                                {aiResponse && !aiResponse.startsWith("Analyzing...") && !aiResponse.startsWith("Error:") &&
                                    <button onClick={copyToClipboard} className="text-xs font-semibold" style={{color: 'var(--text-dim)'}}>Copy</button>
                                }
                            </div>
                            <pre className="h-[calc(100%-100px)] overflow-y-auto p-4 bg-black text-green-400 rounded-lg text-sm whitespace-pre-wrap font-mono">
                                {aiResponse || "> Awaiting query..."}
                            </pre>
                        </div>
                    </div>
                    
                    <div className="py-4">
                         <div className="flex">
                            {/* --- THE FIX IS HERE --- */}
                            <input type="text" className="flex-1 p-3 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" style={{backgroundColor: 'var(--surface-bg)', borderColor: 'var(--border-color)'}} placeholder={mode === 'note' ? "Capture a thought..." : "Ask your brain..."} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} disabled={isLoading} />
                            <button onClick={mode === 'note' ? addNote : askAI} disabled={isLoading} className={`px-4 font-bold text-white rounded-r-lg ${mode === 'note' ? 'bg-blue-600' : 'bg-green-600'} disabled:bg-gray-400`}>
                                {isLoading ? '...' : 'Send'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
             <div className={`fixed bottom-5 bg-gray-900 text-white py-2 px-5 rounded-lg shadow-xl transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
                {toast.message}
            </div>
        </div>
    );
}