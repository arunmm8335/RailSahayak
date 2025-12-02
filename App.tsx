
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Home from './components/Home';
import Services from './components/Services';
import StationIntel from './components/StationIntel';
import FoodDelivery from './components/FoodDelivery';
import GeminiAssistant from './components/GeminiAssistant';
import { Tab, UserProfile } from './types';
import { auth, isFirebaseConfigured } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to Auth state changes (Real or Mock)
  useEffect(() => {
    let unsubscribe = () => {};

    const checkStoredDemoUser = () => {
        const storedUser = localStorage.getItem('railSahayak_demo_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    };

    if (isFirebaseConfigured && auth) {
        // REAL FIREBASE MODE
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            // Robust Name Fallback: DisplayName -> Email prefix -> Default
            const displayName = firebaseUser.displayName 
              || firebaseUser.email?.split('@')[0] 
              || 'Traveller';
              
            const appUser: UserProfile = {
              id: firebaseUser.uid,
              name: displayName,
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${displayName}&background=random`,
              provider: 'EMAIL',
              level: 'Scout', 
              points: 120 
            };
            setUser(appUser);
          } else {
            // FIREBASE RETURNED NULL (No user logged in)
            // CRITICAL FIX: Check if we have a FORCE DEMO USER in local storage.
            // This allows the "Bypass" button to work even if Real Auth is active but failing.
            checkStoredDemoUser();
          }
          setAuthLoading(false);
        });
    } else {
        // DEMO MODE (Firebase Config Missing)
        checkStoredDemoUser();
        setAuthLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // Handler passed to Auth component for Manual/Mock updates
  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    // Always persist to local storage as backup/demo mode
    localStorage.setItem('railSahayak_demo_user', JSON.stringify(newUser));
  };

  const handleLogout = async () => {
    // 1. Immediately clear local state to update UI
    setUser(null);
    setActiveTab(Tab.HOME);

    // 2. Perform cleanup
    try {
        localStorage.removeItem('railSahayak_demo_user');
        if (isFirebaseConfigured && auth) {
            await signOut(auth);
        }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <Home onChangeTab={setActiveTab} language={language} />;
      case Tab.SERVICES:
        return <Services language={language} />;
      case Tab.COMMUNITY:
        return <StationIntel language={language} />;
      case Tab.FOOD:
        return <FoodDelivery language={language} />;
      case Tab.AI_HELP:
        return <GeminiAssistant />;
      default:
        return <Home onChangeTab={setActiveTab} language={language} />;
    }
  };

  if (authLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium animate-pulse">Connecting to RailSahayak...</p>
              </div>
          </div>
      )
  }

  if (!user) {
    return <Auth onLogin={handleLoginSuccess} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      language={language} 
      setLanguage={setLanguage}
      user={user}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
