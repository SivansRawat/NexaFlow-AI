import React, { useState } from "react";
import { userLogin, googleLogin } from "../../lib/api";
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Sparkles, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';
import SEO from '../common/SEO';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      setError("");
      if (credentialResponse.credential) {
        const data = await googleLogin(credentialResponse.credential);
        login(data.user, data.accessToken);
      } else {
        setError("Google authentication failed.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In was cancelled or failed.");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#07070d] text-white relative overflow-hidden px-4 py-12">
      <SEO 
        title="Sign In to Your Workspace"
        description="Access your NexaFlow AI suite. Log in to use PDF Intelligence, AI Excel Formula Master, MailCraft AI, and vector search RAG."
        canonical="/login"
      />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#121324]/80 backdrop-blur-2xl rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-900/20 p-8 sm:p-10 relative z-10">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent">
              NexaFlow AI
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-xs text-gray-400">Sign in to access your AI document & automation tools</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-center w-full mb-5">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            shape="rectangular"
            size="large"
            width="340"
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#16172b] px-3 text-gray-400 font-medium">Or continue with credentials</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider" htmlFor="username">
              Username or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input 
                id="username" 
                name="username" 
                type="text" 
                autoComplete="username" 
                required 
                placeholder="enter your username or email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1b1c33] text-white placeholder-gray-500 border border-gray-700/60 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all text-sm font-medium" 
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="current-password" 
                required 
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1b1c33] text-white placeholder-gray-500 border border-gray-700/60 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all text-sm font-medium" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-2 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:from-cyan-400 hover:via-purple-500 hover:to-pink-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
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

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <span className="text-gray-400 text-xs">Don't have an account? </span>
          <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold text-xs hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}