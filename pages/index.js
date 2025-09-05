import { useState, useEffect } from "react";

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [input, setInput] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [mode, setMode] = useState("note");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("notes") || "[]");
            setNotes(saved);
        } catch (e) {
            setNotes([]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    const addNote = () => {
        if (!input.trim()) return;
        setNotes([...notes, { text: input, date: new Date().toISOString() }]);
        setInput("");
    };

    const askAI = async () => {
        if (!input.trim() || isLoading) return;
        setIsLoading(true);
        setAiResponse("Thinking...");

        const context = notes.map(n => n.text).join("\n");
        const prompt = `Here are my notes as context:\n---\n${context}\n---\n\nNow, answer this question based on the context: ${input}`;

        try {
            const response = await fetch('/api/groq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            setAiResponse(data.result);

        } catch (error) {
            console.error('Error asking AI:', error);
            setAiResponse("Error: Could not connect to the AI brain. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            mode === 'note' ? addNote() : askAI();
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6 font-sans">
            <h1 className="text-4xl font-bold mb-2">🧠 My AI Brain</h1>
            <p className="text-lg text-gray-400 mb-6">Your second brain. Powered by AI.</p>

            <div className="flex gap-2 mb-6">
                <button
                    className={`px-4 py-2 rounded-xl ${mode === "note" ? "bg-blue-600" : "bg-gray-800"}`}
                    onClick={() => setMode("note")}>
                    Notes
                </button>
                <button
                    className={`px-4 py-2 rounded-xl ${mode === "ask" ? "bg-green-600" : "bg-gray-800"}`}
                    onClick={() => setMode("ask")}>
                    Ask AI
                </button>
            </div>

            <div className="w-full max-w-lg">
                <div className="flex mb-4">
                    <input
                        type="text"
                        className="flex-1 p-2 rounded-l-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={mode === 'note' ? "Write a thought..." : "Ask your brain..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        onClick={mode === 'note' ? addNote : askAI}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-r-xl transition-colors ${mode === 'note' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-600 hover:bg-green-500'} disabled:bg-gray-600`}>
                        {isLoading ? "..." : mode === 'note' ? "Save" : "Ask"}
                    </button>
                </div>

                {mode === "note" && (
                    <>
                        <h2 className="text-xl mb-2">📝 Your Notes</h2>
                        <div className="space-y-2">
                            {notes.slice().reverse().map((n, i) => (
                                <div key={i} className="p-2 bg-gray-800 rounded-lg text-sm">{n.text}</div>
                            ))}
                        </div>
                    </>
                )}

                {mode === "ask" && (
                    <>
                    {aiResponse && (
                        <div className="p-4 bg-gray-900 rounded-lg text-sm whitespace-pre-wrap font-mono">
                            {aiResponse}
                        </div>
                    )}
                    </>
                )}
            </div>
        </div>
    );
}