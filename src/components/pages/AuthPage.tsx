import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Check, AlertTriangle, Eye, EyeOff, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthPageProps {
  setActiveTab: (tab: string) => void;
}

// Multi-colored official Google Logo SVG icon
const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

export const AuthPage: React.FC<AuthPageProps> = () => {
  const { login, signup, loginWithGoogle, redirectTab, setActiveTab } = useAuth();
  
  const [activeForm, setActiveForm] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const handleToggleForm = (type: 'login' | 'signup') => {
    setActiveForm(type);
    setErrorMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  // Submit Handler: Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login(email, password);
      triggerToast('Logged in successfully! Welcome back to Melcho.', 'success');
      setTimeout(() => {
        // Redirect back to preceding page
        setActiveTab(redirectTab || 'profile');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
      triggerToast('Incorrect email or password.', 'error');
      setIsLoading(false);
    }
  };

  // Submit Handler: Sign Up
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(name, email, password);
      triggerToast('Account created successfully! Enjoy your signing bonus.', 'success');
      setTimeout(() => {
        setActiveTab(redirectTab || 'profile');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Sign up failed.');
      triggerToast('Error building profile.', 'error');
      setIsLoading(false);
    }
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await loginWithGoogle();
      triggerToast('Authenticated via Google successfully!', 'success');
      setTimeout(() => {
        setActiveTab(redirectTab || 'profile');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Auth aborted.');
      triggerToast('Google Login cancelled.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-28 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Toast notifications container */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              className={`p-4 rounded-xl border shadow-xl flex items-center gap-3 backdrop-blur-md pointer-events-auto ${
                toast.type === 'success' 
                  ? 'bg-green-950/70 border-green-500/40 text-green-300 shadow-green-950/20' 
                  : toast.type === 'error'
                  ? 'bg-red-950/70 border-red-500/40 text-red-300 shadow-red-950/20'
                  : 'bg-primary-brown/80 border-accent-gold/40 text-accent-gold shadow-primary-dark/50'
              }`}
            >
              {toast.type === 'success' && <Check className="w-5 h-5 shrink-0" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0" />}
              {toast.type === 'info' && <Sparkles className="w-5 h-5 shrink-0 animate-pulse" />}
              <span className="text-xs font-semibold">{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Decorative luxury radial background glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Auth page panel layout wrapper */}
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        
        {/* Brand header */}
        <div className="text-center mb-8 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-accent-gold/10 border border-accent-gold/25 px-3 py-1 rounded-full text-[9px] font-bold text-accent-gold tracking-widest uppercase font-mono mb-2">
            Secure Lounge Authentication
          </div>
          <h2 className="text-3xl font-serif text-luxury-cream tracking-wide">
            Melcho <span className="text-accent-gold">Lounge Access</span>
          </h2>
          <p className="text-xs text-luxury-cream/60">Log in or sign up to add items to your cart and place orders.</p>
        </div>

        {/* Form Container (Glassmorphic card) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full glass-effect rounded-3xl border border-accent-gold/15 p-6 md:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Tab Selector Header */}
          <div className="flex bg-primary-dark/50 border border-accent-gold/10 rounded-xl p-1 mb-6">
            <button
              onClick={() => handleToggleForm('login')}
              disabled={isLoading}
              className={`flex-grow py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeForm === 'login'
                  ? 'bg-accent-gold text-primary-dark shadow-[0_2px_10px_rgba(229,192,123,0.25)] font-bold'
                  : 'text-luxury-cream/60 hover:text-accent-gold'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleToggleForm('signup')}
              disabled={isLoading}
              className={`flex-grow py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeForm === 'signup'
                  ? 'bg-accent-gold text-primary-dark shadow-[0_2px_10px_rgba(229,192,123,0.25)] font-bold'
                  : 'text-luxury-cream/60 hover:text-accent-gold'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Error alert block */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 bg-red-950/30 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 text-xs text-red-300"
            >
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Dynamic Switch Forms */}
          <AnimatePresence mode="wait">
            {activeForm === 'login' ? (
              // LOGIN FORM
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-accent-gold font-mono">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-gold" />
                    <input 
                      type="email"
                      placeholder="patron@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl pl-11 pr-4 py-3 text-xs text-luxury-cream focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-accent-gold font-mono">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-gold" />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl pl-11 pr-11 py-3 text-xs text-luxury-cream focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-gold hover:text-accent-gold cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(229,192,123,0.3)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-dark border-t-transparent rounded-full animate-spin" />
                        Validating Credentials...
                      </>
                    ) : (
                      <>
                        Sign In To Lounge <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              // SIGNUP FORM
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSignupSubmit}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-accent-gold font-mono">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-gold" />
                    <input 
                      type="text"
                      placeholder="Yashwanth Galla"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl pl-11 pr-4 py-3 text-xs text-luxury-cream focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-accent-gold font-mono">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-gold" />
                    <input 
                      type="email"
                      placeholder="patron@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl pl-11 pr-4 py-3 text-xs text-luxury-cream focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent-gold font-mono">Password</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl px-4 py-3 text-xs text-luxury-cream focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent-gold font-mono">Confirm</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl px-4 py-3 text-xs text-luxury-cream focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(229,192,123,0.3)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-dark border-t-transparent rounded-full animate-spin" />
                        Generating Profile...
                      </>
                    ) : (
                      <>
                        Register Profile <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-grow h-[1px] bg-accent-gold/15" />
            <span className="text-[10px] text-muted-gold font-mono uppercase tracking-widest">or continue with</span>
            <div className="flex-grow h-[1px] bg-accent-gold/15" />
          </div>

          {/* Google Login button */}
          <div>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-primary-dark/60 hover:bg-primary-brown border border-accent-gold/20 hover:border-accent-gold text-luxury-cream hover:text-accent-gold text-xs font-bold flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

        </motion.div>
      </div>

    </div>
  );
};
export default AuthPage;
