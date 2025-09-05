import { useState, useEffect } from "react";

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [input, setInput] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [mode, setMode] = useState("note");
    const [isLoading, setIsLoading] = useState(false);

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

    const addNote = () => {
        if (!input.trim()) return;
        setNotes([...notes, { text: input, date: new Date().toISOString() }]);
        setInput("");
    };

    const clearNotes = () => {
        if (window.confirm("Are you sure you want to clear all notes? This action cannot be undone.")) {
            setNotes([]);
        }
    };

    const askAI = async () => {
        if (!input.trim() || isLoading) return;
        setIsLoading(true);
        setAiResponse("Analyzing...");
        const context = notes.map(n => n.text).join("\n");
        const prompt = `Here is the context from my notes:\n---\n${context}\n---\n\nBased on that context, answer this question: ${input}`;
        try {
            const response = await fetch('/api/groq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }
            const data = await response.json();
            setAiResponse(data.result);
        } catch (error) {
            console.error('Error asking AI:', error);
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

    // --- SYNTHESIS: The professional light mode infused with the original, soulful copy. ---
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 font-sans">
            <div className="w-full max-w-2xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">My AI Brain</h1>
                    {/* The human, aspirational tagline is restored. */}
                    <p className="text-lg text-gray-500">Your second brain. Powered by AI.</p>
                </header>

                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="flex justify-center gap-2 mb-6">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 ${mode === "note" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"}`}
                            onClick={() => setMode("note")}>
                            📝 Notes
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 ${mode === "ask" ? "bg-green-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"}`}
                            onClick={() => setMode("ask")}>
                            🧠 Ask AI
                        </button>
                    </div>

                    <div className="flex mb-4">
                        <input
                            type="text"
                            className="flex-1 p-3 rounded-l-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            // The iconic placeholder is restored.
                            placeholder={mode === 'note' ? "Capture a thought..." : "Ask your brain..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            onClick={mode === 'note' ? addNote : askAI}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-r-lg font-bold text-white transition-colors flex items-center justify-center ${mode === 'note' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} disabled:bg-gray-400 disabled:cursor-not-allowed`}>
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (mode === 'note' ? 'Save' : 'Ask')}
                        </button>
                    </div>

                    {mode === "note" && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold text-gray-800">Notes</h2>
                                {notes.length > 0 && (
                                    <button onClick={clearNotes} className="text-xs text-red-500 hover:text-red-700 font-semibold">Clear All</button>
                                )}
                            </div>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 border-t border-gray-200 pt-4">
                                {notes.length > 0 ? notes.slice().reverse().map((n, i) => (
                                    <div key={i} className="p-3 bg-gray-100 rounded-lg text-sm text-gray-700">{n.text}</div>
                                )) : (
                                    // The perfect empty state is restored.
                                    <p className="text-center text-gray-400 p-4">Your brain is empty. Start capturing thoughts.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {mode === "ask" && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">AI Analysis</h2>
                            <div className="p-4 bg-gray-900 text-gray-200 rounded-lg text-sm whitespace-pre-wrap font-mono min-h-[100px] border border-gray-700 shadow-inner">
                                {aiResponse || "The AI's response will appear here."}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}