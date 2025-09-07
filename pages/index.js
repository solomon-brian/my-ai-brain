import { useState } from "react";

// --- Placeholder SVG Icons (Engineered for the new design) ---
const LogoIcon = () => (<svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const DashboardIcon = () => (<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>);
const NotesIcon = () => (<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>);
const SearchIcon = () => (<svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
// ... Add other icons for Tasks, Knowledge, etc. as needed

export default function Home() {
    const [activeView, setActiveView] = useState("Dashboard");

    const sidebarItems = ["Dashboard", "Notes", "Tasks", "Knowledge", "Base", "Insights", "Settings"];

    return (
        <div className="h-screen w-screen bg-gray-900 text-gray-200 font-sans flex overflow-hidden">
            
            {/* --- Left Sidebar (The Index) --- */}
            <aside className="w-64 bg-black p-4 flex flex-col flex-shrink-0">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <LogoIcon />
                    <h1 className="text-xl font-bold text-white">myaibrain</h1>
                </div>
                <nav className="flex-1 space-y-2">
                    {sidebarItems.map(item => (
                        <button key={item} onClick={() => setActiveView(item)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeView === item ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}>
                            <DashboardIcon /> {/* Replace with dynamic icons later */}
                            {item}
                        </button>
                    ))}
                </nav>
                <div className="border-t border-gray-800 pt-4">
                    {/* Placeholder for user profile */}
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <div className="flex-1 flex flex-col">
                
                {/* --- Top Bar (The Command Line) --- */}
                <header className="flex-shrink-0 bg-gray-900 border-b border-gray-800 p-4">
                    <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-lg">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ask my AI Brain anything..." />
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Notification and Profile Icons */}
                        </div>
                    </div>
                </header>

                {/* --- Main Canvas (The Cortex) --- */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="w-full h-full border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">[{activeView}] Content Area - Awaiting Functional Components</p>
                    </div>
                </main>
                
                {/* --- Footer Status Bar --- */}
                <footer className="flex-shrink-0 bg-gray-900 border-t border-gray-800 px-6 py-2 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                        <p>AI Activity: Online</p>
                        <p>Last Sync: Just now</p>
                    </div>
                </footer>

            </div>
        </div>
    );
}