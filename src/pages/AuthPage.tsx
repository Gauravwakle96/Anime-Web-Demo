import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Mail, Loader2, AlertCircle, User as UserIcon } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  if (!supabase) {
    return (
      <div className="flex-1 container mx-auto px-4 py-20 max-w-md">
        <div className="bg-card/50 rounded-xl p-8 border border-border flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Backend Not Configured</h2>
          <p className="text-muted-foreground mb-4">
            Please add your Supabase URL and Anon Key to your .env file to enable authentication.
          </p>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    setGoogleLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during Google sign-in';
      setError(message);
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!supabase) return;
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: username || undefined,
              username: username || undefined,
            },
          },
        });
        if (error) throw error;
        navigate('/');
      }
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during authentication';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-16 flex justify-center items-center min-h-screen">
      <div className="bg-card rounded-2xl p-8 border border-border w-full max-w-md shadow-lg shadow-black/20">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isLogin ? 'Sign in to sync your library' : 'Join GAURAVANIME to track your progress'}
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6 flex items-start">
            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-secondary/50 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.54 10.23c.01-.98.01-1.95-.03-2.92h-5.88v5.6h3.72c-1.65 3.17-5.09 4.97-8.82 4.37-1.92-.38-3.62-1.29-5.03-2.7-1.41-1.41-2.32-3.11-2.7-5.03-.59-3.72.9-7.16 4.37-8.82.75-.39 1.57-.62 2.41-.69.74-.07 1.49-.04 2.23.08.84.11 1.62.39 2.3.82.71.46.82.52.82.86v3.26c-.42-.03-3.03-.03-5.51-.01-1.21.01-2.37.15-3.45.44-.37.09-1.55.9-.1.9.86.56 1.85.82 2.87.76 1.33-.08 2.53-.58 3.47-1.45.88-.81 1.55-1.9 1.87-3.13.28-1.05.42-2.13.35-3.2-.22.02-.31.03-.31.03h-7.82c-1.33 1.2-2.13 2.87-2.2 4.66-.08 1.79.3 3.55 1.18 5.06.88 1.51 2.18 2.82 3.83 3.8.03.02.07.04.11.06-1.24 1.2-2.78 1.96-4.55 2.14-.7.05-1.41.07-2.11.07-.84-.01-1.69-.1-2.49-.28-1.56-.34-3.01-.96-4.18-1.85-.19-.16-.38-.33-.44-.57 0 0 0 0 0 0C3.4 8.92 3 7.85 3 6.74 3 5.5 4 4.5 5.25 4.5h16.12c.06.9.09 1.81.06 2.71-.03.86-.13 1.72-.29 2.58 1.62-1.25 2.96-3 3.74-5.03.63-1.6 1-3.31.93-5.05z"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12v6a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3z"
                />
              </svg>
            )}
            {googleLoading ? 'Signing in...' : isLogin ? 'Continue with Google' : 'Sign up with Google'}
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50"></div>
          </div>
          <div className="relative flex justify-center text-xs text-muted-foreground">
            <span className="px-3 bg-card">OR CONTINUE WITH EMAIL</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="Your name"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
