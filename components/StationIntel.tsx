import React, { useState } from 'react';
import { INITIAL_UPDATES, MOCK_LEADERBOARD } from '../constants';
import { StationUpdate } from '../types';
import { analyzeStationUpdate } from '../services/geminiService';

const StationIntel: React.FC = () => {
  const [updates, setUpdates] = useState<StationUpdate[]>(INITIAL_UPDATES);
  const [activeTab, setActiveTab] = useState<'FEED' | 'LEADERBOARD'>('FEED');
  const [isAdding, setIsAdding] = useState(false);
  const [newReportText, setNewReportText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAddReport = async () => {
    if (!newReportText.trim()) return;

    setIsAnalyzing(true);
    // Use Gemini to categorize the report
    const analysis = await analyzeStationUpdate(newReportText);
    
    const newUpdate: StationUpdate = {
        id: Math.random().toString(36).substr(2, 9),
        type: analysis.type,
        severity: analysis.severity,
        text: newReportText,
        upvotes: 0,
        timestamp: new Date(),
        location: 'Current Location', // Mock geolocation
        user: 'You',
        userRank: 'Guide'
    };

    setUpdates([newUpdate, ...updates]);
    setNewReportText('');
    setIsAdding(false);
    setIsAnalyzing(false);
    
    // Trigger Gamification Animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="relative h-full flex flex-col md:flex-row bg-gray-50 dark:bg-gray-950 md:rounded-xl md:overflow-hidden md:border md:border-gray-200 dark:md:border-gray-800 transition-colors duration-200">
       
       {/* Confetti / Points Animation Overlay */}
       {showConfetti && (
         <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
             <div className="bg-black/80 text-white px-8 py-6 rounded-2xl animate-bounce flex flex-col items-center shadow-2xl">
                 <span className="text-4xl">🎉</span>
                 <p className="font-bold text-xl mt-2 text-yellow-400">+50 Karma Points</p>
                 <p className="text-sm">Thanks for being a Sahayak!</p>
             </div>
         </div>
       )}

       {/* Map Section - Hidden on mobile if Leaderboard is active? No, Map is always visible on desktop, hidden on mobile feed/leaderboard toggle usually.
           Actually for mobile, we usually stack map on top. Let's keep existing structure but allow tab switch for the bottom part.
       */}
       <div className={`
           ${activeTab === 'LEADERBOARD' ? 'hidden md:block' : 'block'} 
           h-48 md:h-full md:w-1/2 bg-slate-100 dark:bg-gray-800 relative shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-hidden group transition-colors duration-200
       `}>
           {/* Map Background Pattern */}
           <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Location_dot_black.svg/1024px-Location_dot_black.svg.png')] bg-repeat bg-[length:50px_50px] dark:invert"></div>
           
           {/* Mock Map UI Elements */}
           <div className="absolute inset-0 flex items-center justify-center">
                {/* Station Layout Mockup */}
                <div className="w-[80%] h-[60%] border-4 border-gray-300 dark:border-gray-600 rounded-xl relative bg-white/40 dark:bg-black/40 backdrop-blur-sm">
                    {/* Platform Lines */}
                    <div className="absolute top-1/4 w-full h-2 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="absolute top-2/4 w-full h-2 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="absolute top-3/4 w-full h-2 bg-gray-300 dark:bg-gray-600"></div>
                    
                    {/* Pins */}
                    {updates.slice(0, 3).map((u, i) => (
                        <div key={u.id} className="absolute group/pin cursor-pointer" style={{ top: `${20 + (i*25)}%`, left: `${20 + (i*20)}%` }}>
                            <span className={`absolute -inset-2 rounded-full opacity-20 animate-ping ${
                                u.type === 'ISSUE' ? 'bg-red-400' : u.type === 'INFO' ? 'bg-blue-400' : 'bg-orange-400'
                            }`}></span>
                            <span className="relative text-xl drop-shadow-md">
                                {u.type === 'ISSUE' ? '⚠️' : u.type === 'INFO' ? '🚰' : '👥'}
                            </span>
                        </div>
                    ))}
                </div>
           </div>

           <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">New Delhi (NDLS)</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Live Crowd Heatmap</p>
           </div>
           
           {/* Desktop FAB inside Map Area */}
           <div className="hidden md:block absolute bottom-6 right-6 z-20">
               <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95">
                    <span className="text-xl font-bold">+</span>
                    <span className="font-medium text-sm">Report Issue</span>
               </button>
           </div>
       </div>

       {/* Right Panel: Tabs & Content */}
       <div className="flex-1 -mt-6 md:mt-0 bg-gray-50 dark:bg-gray-900 md:bg-white dark:md:bg-gray-900 rounded-t-3xl md:rounded-none relative z-10 overflow-hidden flex flex-col transition-colors duration-200 h-full">
            
            {/* Tabs Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 rounded-t-3xl md:rounded-none">
                 <div className="flex gap-4">
                     <button 
                        onClick={() => setActiveTab('FEED')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'FEED' ? 'text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                     >
                         Live Alerts
                     </button>
                     <button 
                        onClick={() => setActiveTab('LEADERBOARD')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'LEADERBOARD' ? 'text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                     >
                         Top Sahayaks
                     </button>
                 </div>
                 {activeTab === 'FEED' && (
                    <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-100 dark:border-green-900/30 mb-2">
                         <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                         <span className="text-[10px] font-bold text-green-700 dark:text-green-400">LIVE</span>
                    </div>
                 )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
                
                {/* FEED VIEW */}
                {activeTab === 'FEED' && (
                    <div className="space-y-0">
                        {updates.map((update) => (
                            <div key={update.id} className="p-4 md:p-6 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2 items-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                            update.type === 'ISSUE' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                            update.type === 'CROWD' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                                            'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                        }`}>
                                            {update.type}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {update.location}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-gray-400">
                                        {update.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-3">{update.text}</p>
                                <div className="flex justify-between items-center border-t border-gray-50 dark:border-gray-800/50 pt-2 mt-2">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                                            {update.user ? update.user[0] : 'U'}
                                        </div>
                                        <span className="font-medium text-gray-600 dark:text-gray-300">{update.user || 'Verified User'}</span>
                                        <span className="bg-gray-100 dark:bg-gray-800 px-1.5 rounded text-[9px] border border-gray-200 dark:border-gray-700">{update.userRank || 'Scout'}</span>
                                    </div>
                                    <div className="flex gap-3 text-gray-400 text-xs font-medium opacity-60 group-hover:opacity-100 transition">
                                        <button className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors">
                                            ▲ {update.upvotes}
                                        </button>
                                        <button className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                            ▼
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* LEADERBOARD VIEW */}
                {activeTab === 'LEADERBOARD' && (
                    <div className="p-4 md:p-6 space-y-6">
                        {/* User Stats Card */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
                             <div className="absolute right-0 top-0 text-6xl opacity-10">🏆</div>
                             <p className="text-xs font-medium opacity-80 mb-1">YOUR IMPACT</p>
                             <div className="flex justify-between items-end">
                                 <div>
                                     <span className="text-3xl font-bold block">450</span>
                                     <span className="text-xs opacity-90">Karma Points</span>
                                 </div>
                                 <div className="text-right">
                                     <span className="text-xl font-bold block">#14</span>
                                     <span className="text-xs opacity-90">Station Rank</span>
                                 </div>
                             </div>
                             <div className="mt-4 bg-white/10 rounded-lg p-2 flex justify-between items-center text-xs">
                                 <span>You helped 12 people today!</span>
                                 <span className="font-bold">Next Level: 50pts</span>
                             </div>
                        </div>

                        {/* Top Contributors List */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">This Week's Heroes</h3>
                            <div className="space-y-3">
                                {MOCK_LEADERBOARD.map((user, idx) => (
                                    <div key={user.id} className="flex items-center gap-3 bg-white dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="font-bold text-gray-400 w-6 text-center text-sm">{idx + 1}</div>
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg shadow-sm border border-gray-200 dark:border-gray-600">
                                            {user.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{user.name}</p>
                                                {idx < 3 && <span className="text-xs">
                                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                                </span>}
                                            </div>
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{user.rank}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{user.points}</p>
                                            <p className="text-[10px] text-gray-400">pts</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
       </div>

       {/* Mobile FAB */}
       <button 
        onClick={() => setIsAdding(true)}
        className="md:hidden absolute bottom-6 right-6 bg-black dark:bg-white text-white dark:text-black w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl z-20 border-2 border-white/20">
        +
       </button>

       {/* Report Modal */}
       {isAdding && (
           <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
               <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 border border-gray-200 dark:border-gray-800">
                   <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Report Incident</h3>
                        <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
                   </div>
                   <textarea
                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100 dark:border-gray-700 resize-none text-gray-900 dark:text-white placeholder-gray-400"
                    rows={4}
                    placeholder="Describe the issue (e.g., 'Lift stuck on Platform 2')..."
                    value={newReportText}
                    onChange={(e) => setNewReportText(e.target.value)}
                    autoFocus
                   ></textarea>
                   <div className="flex gap-3 mt-4">
                       <button 
                        onClick={handleAddReport}
                        disabled={isAnalyzing}
                        className="flex-1 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded-xl py-3.5 font-bold text-sm disabled:bg-gray-400 dark:disabled:bg-gray-600 transition shadow-lg">
                           {isAnalyzing ? 'Analyzing...' : 'Submit (+50 Pts)'}
                       </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default StationIntel;