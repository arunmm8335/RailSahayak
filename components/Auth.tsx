
import React, { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebaseConfig';
import { UserProfile } from '../types';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);
  
  // Capture the exact hostname causing the issue
  const [currentHostname, setCurrentHostname] = useState('');

  useEffect(() => {
      if (typeof window !== 'undefined') {
          setCurrentHostname(window.location.hostname);
      }
  }, []);

  // Helper to format Firebase User to App UserProfile
  const mapUser = (uid: string, dName: string, dEmail: string, photo: string | null, provider: 'GOOGLE' | 'EMAIL'): UserProfile => {
    return {
      id: uid,
      name: dName || 'Sahayak User',
      email: dEmail || '',
      avatar: photo || `https://ui-avatars.com/api/?name=${dName || 'User'}&background=random`,
      provider: provider,
      level: 'Scout',
      points: 100
    };
  };

  const handleMockLogin = async (provider: 'GOOGLE' | 'EMAIL') => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockUser = mapUser(
          `mock-${provider.toLowerCase()}-id`, 
          name || 'Demo User', 
          email || 'demo@railsahayak.com', 
          null, 
          provider
      );
      onLogin(mockUser);
      setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setDomainError(null);
    try {
      if (isFirebaseConfigured && auth) {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          await signInWithPopup(auth, provider);
          // App.tsx onAuthStateChanged will handle the rest
      } else {
          // Fallback if keys are missing (should not happen if real keys are set)
          await handleMockLogin('GOOGLE');
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      const code = err.code || '';
      const msg = err.message || '';

      // In Cloud IDEs, "Popup Closed" is almost ALWAYS caused by Domain Mismatch (Popup opens -> sees wrong domain -> closes).
      // So we treat it as a domain error to give the user the right solution.
      if (
          code === 'auth/unauthorized-domain' || 
          msg.includes('unauthorized-domain') ||
          code === 'auth/popup-closed-by-user' ||
          code === 'auth/operation-not-allowed'
      ) {
          setDomainError(window.location.hostname);
      } 
      else if (code === 'auth/popup-blocked') {
           setError('Popup blocked. Please allow popups for this site in your browser settings.');
      }
      else {
          setError(msg || 'Failed to sign in with Google');
      }
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setDomainError(null);

    try {
      if (isFirebaseConfigured && auth) {
          if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password);
          } else {
            await createUserWithEmailAndPassword(auth, email, password);
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: name });
            }
          }
      } else {
          await handleMockLogin('EMAIL');
      }
    } catch (err: any) {
      console.error(err);
      let msg = "Authentication failed";
      if (err.code === 'auth/invalid-credential') msg = "Invalid email or password.";
      if (err.code === 'auth/email-already-in-use') msg = "Email already registered.";
      if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4 transition-colors duration-200 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
      
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-2xl shadow-2xl flex overflow-hidden relative z-10 border border-gray-200 dark:border-gray-800">
        
        {/* Left Side: Brand & Visual */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-blue-700 to-indigo-800 p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
            
            <div className="z-10">
                <h1 className="text-4xl font-bold mb-2">RailSahayak</h1>
                <p className="text-blue-100 text-sm">The Ecosystem for Indian Railway Stations.</p>
            </div>

            <div className="z-10 space-y-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <p className="text-sm font-medium">Live Train Status & Platform Intel</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🍱</span>
                    <p className="text-sm font-medium">Hyperlocal Food Delivery</p>
                </div>
            </div>

            <div className="z-10">
                 <p className="text-xs text-blue-200 opacity-60">© 2024 RailSahayak. All rights reserved.</p>
            </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isLogin ? 'Enter your details to access your journey.' : 'Join the community of Sahayaks.'}
                </p>
            </div>

            {/* DOMAIN ERROR BOX (Critical) */}
            {domainError && (
                <div className="mb-6 p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-left shadow-lg animate-in fade-in slide-in-from-top-2">
                    <h3 className="text-red-700 dark:text-red-300 font-bold text-base flex items-center gap-2 mb-3">
                        <span className="text-xl">⚠️</span> Domain Mismatch Detected
                    </h3>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                        Firebase blocks logins because the <strong>URL in your browser</strong> is not in your Authorized List.
                    </p>

                    <div className="grid grid-cols-1 gap-2 mb-4">
                        <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded border border-red-200 dark:border-red-800">
                            <span className="text-[10px] font-bold text-red-800 dark:text-red-200 block">YOU ARE CURRENTLY ON:</span>
                            <code className="text-xs break-all text-red-600 dark:text-red-300 font-mono">{currentHostname}</code>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded border border-green-200 dark:border-green-800 opacity-70">
                            <span className="text-[10px] font-bold text-green-800 dark:text-green-200 block">FIREBASE EXPECTS:</span>
                            <code className="text-xs text-green-700 dark:text-green-300 font-mono">railsahayak-db848.firebaseapp.com</code>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-black/40 p-3 rounded-lg border border-red-100 dark:border-red-900 mb-4 flex justify-between items-center group">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Copy the red URL above</span>
                        <button 
                            onClick={() => navigator.clipboard.writeText(currentHostname)}
                            className="ml-2 text-[10px] bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-bold shadow-sm"
                        >
                            COPY URL
                        </button>
                    </div>

                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                        <p>1. Go to <a href="https://console.firebase.google.com/" target="_blank" className="underline font-bold text-blue-600">Firebase Console</a> > Auth > Settings.</p>
                        <p>2. Click <strong>Add Domain</strong> and paste the copied URL.</p>
                        <p>3. Come back here and retry.</p>
                    </div>

                    <button 
                        onClick={() => handleGoogleLogin()}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-sm transition shadow-lg flex items-center justify-center gap-2">
                        <span>🔄</span> Retry Google Login
                    </button>
                </div>
            )}

            {/* Standard Error */}
            {error && !domainError && (
                <div className="mb-6 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs rounded-lg text-center font-medium">
                    {error}
                </div>
            )}

            {!domainError && (
                <>
                    {/* OAuth Buttons */}
                    <div className="space-y-3 mb-6">
                        <button 
                            onClick={() => handleGoogleLogin()}
                            disabled={isLoading}
                            type="button"
                            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition active:scale-95 disabled:opacity-50">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            Continue with Google
                        </button>
                    </div>

                    <div className="relative flex py-2 items-center mb-6">
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or use email</span>
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                    </div>

                    {/* Email Form */}
                    <form className="space-y-4" onSubmit={handleEmailAuth}>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg shadow-lg transition transform active:scale-95 disabled:bg-gray-400 disabled:shadow-none flex justify-center items-center">
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center text-sm">
                        <p className="text-gray-600 dark:text-gray-400">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                onClick={() => { setIsLogin(!isLogin); setError(null); setDomainError(null); }}
                                className="ml-2 font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                {isLogin ? 'Register' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
