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

    return (
        // A pure white, stark background. No softness.
        <div className="min-h-screen bg-white text-black flex flex-col items-center p-4 sm:p-6 font-mono">
            <div className="w-full max-w-2xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-2">My AI Brain</h1>
                    <p className="text-lg text-gray-600">A Clarity Engine.</p>
                </header>

                {/* The Instrument: A hard, defined border. No shadows. This is a tool, not a decoration. */}
                <div className="bg-white border-2 border-black rounded-lg p-4 sm:p-6">
                    <div className="flex justify-center gap-2 mb-6">
                        <button
                            className={`px-4 py-2 rounded text-sm sm:text-base font-bold transition-all duration-150 border-2 border-black ${mode === "note" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"}`}
                            onClick={() => setMode("note")}>
                            LOG_NOTE
                        </button>
                        <button
                            className={`px-4 py-2 rounded text-sm sm:text-base font-bold transition-all duration-150 border-2 border-black ${mode === "ask" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"}`}
                            onClick={() => setMode("ask")}>
                            QUERY_BRAIN
                        </button>
                    </div>

                    <div className="flex mb-4">
                        <input
                            type="text"
                            className="flex-1 p-3 rounded-l bg-white text-black border-2 border-r-0 border-black focus:outline-none"
                            placeholder={mode === 'note' ? "Input data..." : "Enter query..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            onClick={mode === 'note' ? addNote : askAI}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-r font-bold text-white transition-colors flex items-center justify-center border-2 border-l-0 border-black ${mode === 'note' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} disabled:bg-gray-500`}>
                            {isLoading ? "..." : "EXECUTE"}
                        </button>
                    </div>

                    {mode === "note" && (
                        <div>
                            <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-2">
                                <h2 className="text-lg font-bold">DATA_LOG</h2>
                                {notes.length > 0 && (
                                    <button onClick={clearNotes} className="text-xs text-red-600 hover:underline font-bold">PURGE_LOG</button>
                                )}
                            </div>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 pt-2">
                                {notes.length > 0 ? notes.slice().reverse().map((n, i) => (
                                    <div key={i} className="p-2 border border-gray-300 rounded-sm text-sm">{n.text}</div>
                                )) : (
                                    <p className="text-center text-gray-500 p-4">LOG EMPTY. AWAITING DATA INPUT.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {mode === "ask" && (
                        <div>
                            <h2 className="text-lg font-bold border-b-2 border-black pb-2 mb-2">AI_RESPONSE</h2>
                            <pre className="p-4 bg-black text-green-400 rounded text-sm whitespace-pre-wrap font-mono min-h-[100px]">
                                {aiResponse || "> Awaiting query..."}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}