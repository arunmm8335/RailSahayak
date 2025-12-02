
import React, { useState, useEffect } from 'react';
import { Tab, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  language: 'EN' | 'HI';
  setLanguage: (lang: 'EN' | 'HI') => void;
  user: UserProfile;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, language, setLanguage, user, onLogout, children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileStats, setShowProfileStats] = useState(false);
  const [isSosActive, setIsSosActive] = useState(false);

  const t = TRANSLATIONS[language].nav;

  // Safe Name Accessor
  const firstName = user.name ? user.name.split(' ')[0] : 'Traveller';

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => setLanguage(language === 'EN' ? 'HI' : 'EN');

  const handleSOS = () => {
    const confirmSos = window.confirm("⚠️ SOS ACTIVATED\n\nCall Railway Protection Force (139)?");
    if(confirmSos) {
        setIsSosActive(true);
        setTimeout(() => setIsSosActive(false), 5000);
    }
  }

  const handleLogoutClick = () => {
      if(window.confirm("Are you sure you want to logout?")) {
          onLogout();
      }
  }

  const navItems = [
    { id: Tab.HOME, label: t.home, icon: '🏠' },
    { id: Tab.SERVICES, label: t.services, icon: '🛎️' },
    { id: Tab.FOOD, label: t.food, icon: '🍱' },
    { id: Tab.COMMUNITY, label: t.community, icon: '📢' },
    { id: Tab.AI_HELP, label: t.ai, icon: '🤖' },
  ];

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden w-full transition-colors duration-200 ${isSosActive ? 'ring-8 ring-inset ring-red-500 animate-pulse' : ''}`}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm z-20 transition-colors duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
           <div className="flex flex-col">
              <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-800 dark:text-blue-400">
                🚆 RailSahayak
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  System Online
                </span>
              </div>
           </div>
           {/* Desktop Theme Toggle */}
           <button 
             onClick={toggleTheme}
             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-xl transition-colors"
             title="Toggle Theme"
           >
             {isDarkMode ? '🌙' : '☀️'}
           </button>
        </div>
        
        {/* Language & SOS Desktop */}
        <div className="px-6 py-4 flex gap-3">
             <button 
                onClick={toggleLanguage}
                className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg py-1 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                {language === 'EN' ? 'हिंदी' : 'English'}
             </button>
             <button 
                onClick={handleSOS}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-1 text-sm font-bold shadow-sm animate-pulse">
                SOS
             </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 w-full p-3 rounded-lg transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <span className={`text-xl transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
              {activeTab === item.id && (
                  <span className="ml-auto w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
              )}
            </button>
          ))}
        </nav>
        
        {/* User / Journey Card */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
             <div 
                onClick={() => setShowProfileStats(!showProfileStats)}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
             >
                {/* Decoration */}
                <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl transform rotate-12 group-hover:rotate-0 transition duration-500">
                    {showProfileStats ? '🏆' : '🚆'}
                </div>
                
                {!showProfileStats ? (
                    <>
                        <div className="flex items-center gap-2 mb-2">
                            <img src={user.avatar} className="w-8 h-8 rounded-full border border-white/50 bg-white" alt={user.name} />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-blue-200 font-medium truncate">Welcome,</p>
                                <p className="font-bold text-sm tracking-wide truncate">{firstName}</p>
                            </div>
                        </div>
                        <p className="font-bold text-xs tracking-wide bg-white/10 px-2 py-1 rounded w-fit">12951 - Rajdhani</p>
                        <div className="mt-3 flex gap-3 text-xs border-t border-white/20 pt-2">
                            <div>
                                <span className="block opacity-70 text-[10px] uppercase">Coach</span>
                                <span className="font-bold text-lg leading-none">B5</span>
                            </div>
                            <div>
                                <span className="block opacity-70 text-[10px] uppercase">Seat</span>
                                <span className="font-bold text-lg leading-none">32</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                         <p className="text-xs text-blue-100 font-medium mb-1 flex justify-between items-center">
                            SAHAYAK PROFILE
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🛡️</span>
                            <div>
                                <p className="font-bold text-sm tracking-wide leading-none">{user.level}</p>
                                <p className="text-[10px] opacity-80">Next: Guardian</p>
                            </div>
                        </div>
                        
                        <div className="mt-1">
                            <div className="flex justify-between text-[10px] mb-1 font-medium">
                                <span>Karma: {user.points}</span>
                                <span>Goal: 500</span>
                            </div>
                            <div className="w-full bg-black/20 rounded-full h-1.5">
                                <div className="bg-yellow-400 h-1.5 rounded-full" style={{width: `${(user.points/500)*100}%`}}></div>
                            </div>
                        </div>
                    </>
                )}
             </div>

             {/* Explicit Desktop Logout Button */}
             <button 
                onClick={handleLogoutClick}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-lg transition-colors"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
             </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="md:hidden bg-blue-700 dark:bg-gray-900 text-white p-4 shadow-md z-10 flex justify-between items-center shrink-0 transition-colors duration-200">
            <h1 className="text-xl font-bold flex items-center gap-2">
              🚆 RailSahayak
            </h1>
            <div className="flex items-center gap-3">
               <button onClick={toggleLanguage} className="text-xs font-bold border border-white/30 rounded px-2 py-1">
                 {language === 'EN' ? 'HI' : 'EN'}
               </button>
               <button onClick={handleSOS} className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center animate-pulse shadow-lg border border-red-400">
                 🚨
               </button>
              <button 
                onClick={toggleTheme} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 dark:bg-gray-800 border border-blue-500 dark:border-gray-700 text-sm"
              >
                {isDarkMode ? '🌙' : '☀️'}
              </button>
              <div className="relative group flex items-center gap-2">
                  <img 
                    src={user.avatar} 
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-white/50 bg-white" 
                  />
                  {/* Mobile Logout Icon */}
                  <button 
                    onClick={handleLogoutClick}
                    className="bg-white/20 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  </button>
              </div>
            </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative bg-gray-50/50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto w-full h-full md:p-6 pb-20 md:pb-6">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden absolute bottom-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-20 pb-safe transition-colors duration-200">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                  activeTab === item.id
                    ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-gray-800'
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'
                }`}
              >
                <span className={`text-2xl mb-1 transition-transform ${activeTab === item.id ? 'scale-110' : ''}`}>{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
