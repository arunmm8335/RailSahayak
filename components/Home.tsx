import React, { useState } from 'react';
import { MOCK_PNR, TRAIN_NUMBER, CURRENT_STATION, TRANSLATIONS } from '../constants';
import { Tab } from '../types';

interface HomeProps {
    onChangeTab: (tab: Tab) => void;
    language: 'EN' | 'HI';
}

const Home: React.FC<HomeProps> = ({ onChangeTab, language }) => {
  // Mock Coach Composition
  const coaches = ['ENG', 'PWR', 'H1', 'A1', 'A2', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'PC', 'S1', 'S2', 'S3', 'S4', 'GEN', 'GRD'];
  const userCoach = 'B5';
  
  const [alarmSet, setAlarmSet] = useState(false);
  const t = TRANSLATIONS[language].home;

  return (
    <div className="p-4 md:p-0 space-y-4 md:space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Live Status Card - Spans 2 cols on desktop */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden flex flex-col transition-colors duration-200">
            {/* Gradient Top Bar */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>
            
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                            {TRAIN_NUMBER}
                            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">SUPERFAST</span>
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">PNR: {MOCK_PNR}</p>
                            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                            <p className="text-sm text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                {t.runningStatus}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black text-gray-800 dark:text-white">110 <span className="text-sm font-medium text-gray-400">km/h</span></p>
                    </div>
                </div>
                
                {/* Timeline Visualization */}
                <div className="relative px-4 pb-8">
                    {/* Connecting Line Desktop */}
                    <div className="hidden md:block absolute top-[14px] left-8 right-8 h-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                         <div className="h-full w-1/2 bg-blue-500 rounded-l-full relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full shadow border-2 border-white dark:border-gray-900 z-10"></div>
                         </div>
                    </div>
                    {/* Connecting Line Mobile */}
                    <div className="md:hidden absolute left-[27px] top-8 bottom-8 w-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                         <div className="w-full h-1/2 bg-blue-500 rounded-t-full relative"></div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative z-10">
                        {/* Previous Station */}
                        <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3 group">
                            <div className="w-14 h-14 md:w-6 md:h-6 rounded-full bg-blue-50 dark:bg-gray-800 border-2 border-blue-500 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 md:bg-blue-600 md:border-white dark:md:border-gray-900 md:shadow-sm">
                                <span className="md:hidden">✓</span>
                            </div>
                            <div className="md:text-left md:w-32">
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-0.5">{t.departed}</p>
                                <p className="font-bold text-gray-800 dark:text-gray-200 text-lg md:text-base leading-none">Agra Cantt</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">10:30 AM</p>
                            </div>
                        </div>

                        {/* Current Station (Active) */}
                        <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-3">
                            <div className="w-14 h-14 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-600 shadow-xl flex items-center justify-center shrink-0 z-20">
                                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping"></div>
                            </div>
                            <div className="md:text-center md:w-48 bg-blue-50 dark:bg-blue-900/20 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none border border-blue-100 dark:border-blue-900/30 md:border-none w-full">
                                <p className="text-xs text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider mb-0.5">{t.approaching}</p>
                                <p className="font-black text-blue-900 dark:text-blue-100 text-xl md:text-2xl leading-none">{CURRENT_STATION}</p>
                                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mt-1">12:45 PM <span className="text-blue-400 mx-1">|</span> <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-1.5 rounded">PF 12</span></p>
                            </div>
                        </div>

                        {/* Next Station */}
                        <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3 opacity-60">
                            <div className="w-14 h-14 md:w-6 md:h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0">
                                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
                            </div>
                            <div className="md:text-right md:w-32">
                                <div className="flex items-center gap-2 md:justify-end mb-0.5">
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{t.nextStop}</p>
                                    <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-1 rounded">32°C ☀️</span>
                                </div>
                                <p className="font-bold text-gray-800 dark:text-gray-300 text-lg md:text-base leading-none">Kota Jn</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">03:20 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coach Composition Strip */}
                <div className="mt-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-end mb-3">
                         <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Train Composition</h3>
                         <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded font-medium">
                            You are in <strong className="text-blue-800 dark:text-blue-200">{userCoach}</strong>
                         </p>
                    </div>
                    
                    {/* Scrollable Train Container */}
                    <div className="relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="overflow-x-auto flex gap-1 pb-4 no-scrollbar items-center">
                            {coaches.map((coach, idx) => {
                                const isUserCoach = coach === userCoach;
                                const isEngine = coach === 'ENG';
                                return (
                                    <div key={idx} className={`flex flex-col items-center gap-1 shrink-0 transition-transform ${isUserCoach ? 'scale-110 mx-2' : 'opacity-60 hover:opacity-100'}`}>
                                        <div className={`
                                            w-12 h-8 rounded-sm border-b-2 flex items-center justify-center text-[10px] font-bold shadow-sm relative
                                            ${isEngine ? 'bg-red-700 text-white border-red-900 rounded-r-xl' : ''}
                                            ${isUserCoach ? 'bg-blue-600 text-white border-blue-800 z-10' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700'}
                                            ${!isEngine && !isUserCoach ? 'bg-gray-50 dark:bg-gray-800' : ''}
                                        `}>
                                            {coach}
                                            {/* Connector */}
                                            {!isEngine && <div className="absolute -left-1.5 top-1/2 w-1.5 h-0.5 bg-gray-400 dark:bg-gray-600"></div>}
                                            {/* Wheels */}
                                            <div className="absolute -bottom-1 left-1 w-1.5 h-1.5 bg-black dark:bg-gray-900 rounded-full opacity-50"></div>
                                            <div className="absolute -bottom-1 right-1 w-1.5 h-1.5 bg-black dark:bg-gray-900 rounded-full opacity-50"></div>
                                        </div>
                                        {isUserCoach && <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Station Alarm & Alerts */}
        <div className="flex flex-col gap-4 h-full">
            
            {/* DESTINATION ALARM WIDGET */}
            <div className={`rounded-xl shadow-sm border p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${alarmSet ? 'bg-indigo-900 border-indigo-700 text-white' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
                <div className="flex justify-between items-start z-10">
                    <div>
                        <h3 className={`font-bold text-lg ${alarmSet ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                            {t.alarm}
                        </h3>
                        <p className={`text-xs mt-1 ${alarmSet ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
                            {alarmSet ? 'Tracking location...' : 'Wake me before Kota Jn'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setAlarmSet(!alarmSet)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${alarmSet ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${alarmSet ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <div className="mt-6 flex items-end gap-2 z-10">
                    <span className={`text-4xl font-light ${alarmSet ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                        240
                    </span>
                    <span className={`text-sm mb-1.5 font-medium ${alarmSet ? 'text-indigo-200' : 'text-gray-400'}`}>km remaining</span>
                </div>

                {/* Decoration */}
                <div className={`absolute -bottom-4 -right-4 text-8xl opacity-10 transition-transform duration-500 ${alarmSet ? 'scale-110 rotate-12' : 'scale-100'}`}>
                    ⏰
                </div>
            </div>

            {/* Recent Alerts Preview - Spans 1 col on desktop */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex-1 flex flex-col transition-colors duration-200">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span className="animate-pulse text-red-500">●</span> Station Pulse
                    </h3>
                    <button onClick={() => onChangeTab(Tab.COMMUNITY)} className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-1 rounded transition">VIEW ALL</button>
                </div>
                <div className="p-0 flex-1 overflow-y-auto max-h-[300px] md:max-h-none">
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition border-b border-gray-50 dark:border-gray-800 cursor-pointer">
                        <div className="flex justify-between items-start">
                             <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-red-200 dark:border-red-900">HIGH PRIORITY</span>
                             <span className="text-[10px] text-gray-400">2m ago</span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mt-1">Escalator on Platform 4 broken.</p>
                        <p className="text-xs text-gray-400 mt-1">45 people found this helpful</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition border-b border-gray-50 dark:border-gray-800 cursor-pointer">
                         <div className="flex justify-between items-start">
                             <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200 dark:border-blue-900">INFO</span>
                             <span className="text-[10px] text-gray-400">15m ago</span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mt-1">New water vending machine installed near Coach A1.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="font-bold text-gray-700 dark:text-gray-300 md:text-lg mb-3 flex items-center gap-2">
            {t.quickActions}
            <span className="text-xs font-normal text-gray-400 hidden md:inline-block">- Instant services for your journey</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <button 
                onClick={() => onChangeTab(Tab.SERVICES)}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-700 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-125 duration-500">
                    <span className="text-6xl grayscale dark:invert">🧳</span>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-2xl group-hover:bg-red-500 transition-colors duration-300 z-10 text-red-600 dark:text-red-400 group-hover:text-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <div className="text-center z-10">
                    <span className="font-bold text-sm text-gray-800 dark:text-gray-200 block">{t.bookCoolie}</span>
                    <span className="text-[10px] text-gray-400 hidden md:block mt-1">Get luggage help</span>
                </div>
            </button>

            <button 
                onClick={() => onChangeTab(Tab.FOOD)}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-125 duration-500">
                    <span className="text-6xl grayscale dark:invert">🍔</span>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-2xl group-hover:bg-orange-500 transition-colors duration-300 z-10 text-orange-600 dark:text-orange-400 group-hover:text-white shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div className="text-center z-10">
                    <span className="font-bold text-sm text-gray-800 dark:text-gray-200 block">{t.orderFood}</span>
                    <span className="text-[10px] text-gray-400 hidden md:block mt-1">Delivery to seat</span>
                </div>
            </button>

            <button 
                onClick={() => onChangeTab(Tab.COMMUNITY)}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-125 duration-500">
                    <span className="text-6xl grayscale dark:invert">📍</span>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-2xl group-hover:bg-indigo-500 transition-colors duration-300 z-10 text-indigo-600 dark:text-indigo-400 group-hover:text-white shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div className="text-center z-10">
                    <span className="font-bold text-sm text-gray-800 dark:text-gray-200 block">{t.platformIntel}</span>
                    <span className="text-[10px] text-gray-400 hidden md:block mt-1">Crowdsourced info</span>
                </div>
            </button>

            <button 
                onClick={() => onChangeTab(Tab.AI_HELP)}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-teal-300 dark:hover:border-teal-700 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-125 duration-500">
                    <span className="text-6xl grayscale dark:invert">🤖</span>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-2xl group-hover:bg-teal-500 transition-colors duration-300 z-10 text-teal-600 dark:text-teal-400 group-hover:text-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <div className="text-center z-10">
                    <span className="font-bold text-sm text-gray-800 dark:text-gray-200 block">{t.askSahayak}</span>
                    <span className="text-[10px] text-gray-400 hidden md:block mt-1">AI Assistant</span>
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Home;