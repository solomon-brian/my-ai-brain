import { useState, useEffect } from "react";

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [input, setInput] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [mode, setMode] = useState("note");
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "" });

    // Toast notification handler
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: "" });
            }, 2000); // Hide after 2 seconds
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (message) => {
        setToast({ show: true, message });
    };

    // Load/Save notes from/to localStorage
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("myaibrain_notes") || "[]");
            setNotes(saved);
        } catch (e) {
            console.error("Failed to parse notes from localStorage", e);
            setNotes([]);
        }
    }, []);
    useEffect(() => {
        localStorage.setItem("myaibrain_notes", JSON.stringify(notes));
    }, [notes]);

    // Core Functions
    const addNote = () => {
        if (!input.trim()) return;
        setNotes([...notes, { text: input, date: new Date().toISOString() }]);
        setInput("");
        showToast("Note saved.");
    };

    const clearNotes = () => {
        if (window.confirm("Are you sure you want to clear all notes? This action cannot be undone.")) {
            setNotes([]);
            showToast("Notes cleared.");
        }
    };

    const askAI = async () => {
        if (!input.trim() || isLoading) return;
        setIsLoading(true);
        setAiResponse(""); // Clear previous response

        // Simulate a streaming effect for a better UX
        const loadingAnimation = setInterval(() => {
            setAiResponse(prev => prev + ".");
        }, 300);

        const context = notes.map(n => n.text).join("\n");
        const prompt = `Here is the context from my notes:\n---\n${context}\n---\n\nBased on that context, answer this question: ${input}`;
        
        try {
            const response = await fetch('/api/groq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            clearInterval(loadingAnimation); // Stop the "..." animation
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }
            const data = await response.json();
            setAiResponse(data.result);
        } catch (error) {
            console.error('Error asking AI:', error);
            clearInterval(loadingAnimation);
            setAiResponse(`Error: Connection to the AI brain failed.\n${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            mode === 'note' ? addNote() : askAI();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 font-sans text-gray-800">
            
            {/* The Professional Header */}
            <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-4 mb-4">
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 text-blue-600" /* Your SVG Logo here */ viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.64-.33 2.49-.33.85 0 1.7.11 2.49.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.72c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z"/></svg>
                    <h1 className="text-xl font-bold text-gray-900">My AI Brain</h1>
                </div>
                <a href="#" className="text-sm font-semibold text-gray-600 hover:text-blue-600">About the Protocol</a>
            </header>

            <main className="w-full max-w-2xl mx-auto">
                {/* The Main Instrument Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                    {/* The rest of your app UI */}
                    <div className="flex justify-center gap-2 mb-6">
                        <button className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 ${mode === "note" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"}`} onClick={() => setMode("note")}>📝 Capture Note</button>
                        <button className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 ${mode === "ask" ? "bg-green-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"}`} onClick={() => setMode("ask")}>🧠 Ask AI</button>
                    </div>

                    <div className="flex mb-4">
                        <input type="text" className="flex-1 p-3 rounded-l-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={mode === 'note' ? "Capture a thought..." : "Ask your brain..."} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} disabled={isLoading}/>
                        <button onClick={mode === 'note' ? addNote : askAI} disabled={isLoading} className={`px-4 py-2 rounded-r-lg font-bold text-white transition-colors flex items-center justify-center ${mode === 'note' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} disabled:bg-gray-400 disabled:cursor-not-allowed`}>{isLoading ? (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : (mode === 'note' ? 'Save' : 'Ask')}</button>
                    </div>

                    {/* Animated Content Areas */}
                    <div className="relative">
                        <div className={`transition-opacity duration-300 ${mode === 'note' ? 'opacity-100' : 'opacity-0 absolute w-full'}`}>
                            {/* Note Section */}
                            <h2 className="text-xl font-bold text-gray-800">Notes</h2>
                             {notes.length > 0 && (<button onClick={clearNotes} className="text-xs text-red-500 hover:text-red-700 font-semibold float-right">Clear All</button>)}
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 border-t border-gray-200 pt-4 mt-2">
                                {notes.length > 0 ? notes.slice().reverse().map((n, i) => (<div key={i} className="p-3 bg-gray-100 rounded-lg text-sm text-gray-700">{n.text}</div>)) : (<p className="text-center text-gray-400 p-4">Your brain is empty. Start capturing thoughts.</p>)}
                            </div>
                        </div>

                        <div className={`transition-opacity duration-300 ${mode === 'ask' ? 'opacity-100' : 'opacity-0'}`}>
                           {/* AI Section */}
                           <h2 className="text-xl font-bold text-gray-800 mb-2">AI Analysis</h2>
                           <div className="p-4 bg-gray-900 text-gray-200 rounded-lg text-sm whitespace-pre-wrap font-mono min-h-[100px] border border-gray-700 shadow-inner">
                               {aiResponse || "> Awaiting query..."}
                           </div>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Toast Notification */}
            <div className={`fixed bottom-5 right-5 bg-gray-900 text-white py-2 px-4 rounded-lg shadow-lg transition-transform duration-300 ${toast.show ? 'transform translate-y-0' : 'transform translate-y-20'}`}>
                {toast.message}
            </div>
        </div>
    );
}