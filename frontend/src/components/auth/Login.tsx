import React, { useState } from "react";
import { userLogin, googleLogin } from "../../lib/api";
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';
import SEO from '../common/SEO';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError("");
        const token = tokenResponse.access_token;
        if (token) {
          const data = await googleLogin(token);
          login(data.user, data.accessToken);
        } else {
          setError("Google authentication failed.");
        }
      } catch (err: any) {
        setError(err?.response?.data?.error || "Google authentication failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google Sign-In was cancelled or failed.");
    }
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const usernameOrEmail = (form.username as any).value;
    const password = (form.password as any).value;
    try {
      const payload = usernameOrEmail.includes("@")
        ? { email: usernameOrEmail, password }
        : { username: usernameOrEmail, password };
      const data = await userLogin(payload);
      login(data.user, data.accessToken);
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Invalid username or password. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-white relative overflow-hidden px-4 py-12">
      <SEO 
        title="Sign In to Your Workspace"
        description="Access your NexaFlow AI suite. Log in to use PDF Intelligence, AI Excel Formula Master, MailCraft AI, and vector search RAG."
        canonical="/login"
      />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2640D9]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#8A66E6]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-gradient-to-br from-[#2640D9]/25 via-transparent to-[#262626]/40 p-[1px] rounded-[24px] shadow-2xl relative z-10">
        <div className="bg-[#0b0b0f] w-full h-full rounded-[23px] p-8 sm:p-10 flex flex-col">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2640D9] via-[#8A66E6] to-[#6633E6] p-[1.5px] shadow-lg shadow-[#2640D9]/20 transition-transform duration-200 group-hover:scale-105 flex items-center justify-center">
                <div className="w-full h-full bg-[#050505] rounded-full flex items-center justify-center">
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2640D9] to-[#6633E6] text-base">N</span>
                </div>
              </div>
              <span className="text-2xl font-extralight tracking-tight bg-gradient-to-r from-white to-[#8A66E6] bg-clip-text text-transparent font-['Inter']">
                NexaFlow <span className="font-semibold">AI</span>
              </span>
            </Link>
            <h2 className="text-2xl font-extralight text-white mb-2 font-['Inter']">Welcome Back</h2>
            <p className="text-xs text-[#737373] font-normal">Sign in to access your AI document & automation tools</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-5 w-full">
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-full bg-[#050505] hover:bg-[#2640D9]/5 border border-[#262626] hover:border-[#2640D9]/30 text-white font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-200 shadow-md group active:scale-[0.99]"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#262626]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-[#0b0b0f] px-3 text-[#737373]">Or continue with credentials</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-bold text-[#737373] mb-1.5 uppercase tracking-widest" htmlFor="username">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-[#737373]">
                  <User className="w-4 h-4" />
                </div>
                <input 
                  id="username" 
                  name="username" 
                  type="text" 
                  autoComplete="username" 
                  required 
                  placeholder="enter your username or email"
                  className="w-full pl-11 pr-5 py-3 rounded-full bg-[#050505] text-white placeholder-[#737373] border border-[#262626] focus:border-[#2640D9] focus:outline-none transition-all text-xs sm:text-sm font-normal" 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold text-[#737373] uppercase tracking-widest" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-[#737373]">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  placeholder="••••••••"
                  className="w-full pl-11 pr-5 py-3 rounded-full bg-[#050505] text-white placeholder-[#737373] border border-[#262626] focus:border-[#2640D9] focus:outline-none transition-all text-xs sm:text-sm font-normal" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full mt-2 bg-[#2640D9] hover:bg-[#6633E6] text-white font-bold py-3.5 rounded-full shadow-lg shadow-[#2640D9]/20 transition-all duration-200 flex items-center justify-center gap-2 text-xs tracking-widest uppercase"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#262626] text-center">
            <span className="text-[#737373] text-xs font-normal">Don't have an account? </span>
            <Link to="/signup" className="text-[#8A66E6] hover:text-[#2640D9] font-bold text-xs transition-colors hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}