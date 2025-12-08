
import React, { useState, useEffect } from 'react';
import { 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
  const [error, setError] = useState<{message: string, hint?: string} | null>(null);
  
  // Capture the exact hostname causing the issue
  const [currentHostname, setCurrentHostname] = useState('');
  const [isBlobEnv, setIsBlobEnv] = useState(false);

  const getRobustHostname = () => {
    if (typeof window === 'undefined') return '';
    
    // 1. Handle blob URLs (Critical for this user's environment)
    if (window.location.protocol === 'blob:' || window.location.href.startsWith('blob:')) {
        try {
            const raw = window.location.href.replace('blob:', '');
            const url = new URL(raw);
            return url.hostname;
        } catch (e) {
            const parts = window.location.href.split('/');
            if (parts.length > 2) return parts[2];
        }
    }
    return window.location.hostname || window.location.host || '';
  };

  useEffect(() => {
      const host = getRobustHostname();
      setCurrentHostname(host);
      // Strict check for blob environment
      setIsBlobEnv(window.location.protocol === 'blob:' || window.location.href.startsWith('blob:'));
      
      const checkRedirectResult = async () => {
        if (isFirebaseConfigured && auth) {
          try {
            const pending = localStorage.getItem('railSahayak_auth_pending');
            if (pending) {
              setIsLoading(true);
              await getRedirectResult(auth);
              localStorage.removeItem('railSahayak_auth_pending');
              setIsLoading(false);
            }
          } catch (err: any) {
            console.error('❌ Redirect result error:', err);
            localStorage.removeItem('railSahayak_auth_pending');
            setIsLoading(false);
          }
        }
      };
      checkRedirectResult();
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

  const handleGoogleLogin = async (useRedirect = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isFirebaseConfigured && auth) {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          
          if (useRedirect) {
            localStorage.setItem('railSahayak_auth_pending', 'true');
            await signInWithRedirect(auth, provider);
          } else {
            await signInWithPopup(auth, provider);
          }
      } else {
          await handleMockLogin('GOOGLE');
      }
    } catch (err: any) {
      console.error("❌ Auth Error:", err.code, err.message);
      setError({ message: err.message });
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
      console.error('❌ Email Auth Error:', err.code);
      let msg = "Authentication failed";
      let hint = "";

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
          msg = "Invalid email or password.";
          if (isLogin) hint = "Check for typos or try creating a new account.";
      }
      if (err.code === 'auth/user-not-found') {
          msg = "No account found.";
          hint = "Please switch to the 'Register' tab to create an account first.";
      }
      if (err.code === 'auth/email-already-in-use') {
          msg = "Email already registered.";
          hint = "Try logging in instead.";
      }
      if (err.code === 'auth/operation-not-allowed') {
          msg = "Email/Password login is not enabled.";
          hint = "Go to Firebase Console > Authentication > Sign-in method and enable 'Email/Password'.";
      }

      setError({ message: msg, hint: hint });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4 transition-colors duration-200 relative overflow-hidden">
      
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
      
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-2xl shadow-2xl flex overflow-hidden relative z-10 border border-gray-200 dark:border-gray-800">
        
        {/* Left Side */}
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

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isLogin ? 'Enter your details to access your journey.' : 'Join the community of Sahayaks.'}
                </p>
            </div>

            {/* Blob Environment Alert */}
            {isBlobEnv && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4 text-xs">
                    <div className="flex items-start gap-2 mb-2">
                        <span className="text-lg">ℹ️</span>
                        <div>
                            <strong className="text-blue-800 dark:text-blue-200 block mb-1">Dynamic Preview Environment Detected</strong>
                            <p className="text-blue-700 dark:text-blue-300">
                                This cloud environment rotates domains automatically.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-black/20 p-2 rounded mt-2 text-gray-700 dark:text-gray-300">
                        <p><strong>Recommendation:</strong> Use <strong>Email/Password</strong> below.</p>
                        <p className="opacity-80 mt-1">Google Sign-In requires a static domain and will fail here.</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-lg text-left">
                    <p className="font-bold flex items-center gap-2">⚠️ {error.message}</p>
                    {error.hint && <p className="mt-1 opacity-90 text-xs">{error.hint}</p>}
                </div>
            )}

            {/* Google Auth - Disabled in Blob */}
            <div className="space-y-3 mb-6">
                <button 
                    onClick={() => handleGoogleLogin(false)}
                    disabled={isLoading || isBlobEnv}
                    title={isBlobEnv ? "Not available in dynamic preview environment" : "Sign in with Google"}
                    type="button"
                    className={`w-full flex items-center justify-center gap-3 border font-medium py-2.5 rounded-lg transition active:scale-95 shadow-sm relative ${
                        isBlobEnv 
                        ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed opacity-60' 
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className={`w-5 h-5 ${isBlobEnv ? 'grayscale opacity-50' : ''}`} alt="Google" />
                    {isBlobEnv ? 'Google Sign-In (Unavailable in Preview)' : 'Continue with Google'}
                </button>
            </div>

            <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-bold tracking-wider">
                    {isBlobEnv ? 'Recommended Method' : 'Or use email'}
                </span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            </div>

            {/* Email Form - REAL AUTH */}
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
                        isLogin ? 'Sign In (Real Auth)' : 'Create Account'
                    )}
                </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                        className="ml-2 font-bold text-blue-600 dark:text-blue-400 hover:underline">
                        {isLogin ? 'Register' : 'Sign In'}
                    </button>
                </p>
            </div>
            
            {/* Fallback */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                <button 
                    onClick={() => handleMockLogin('GOOGLE')}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline">
                    I can't get this to work (Emergency Bypass)
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
