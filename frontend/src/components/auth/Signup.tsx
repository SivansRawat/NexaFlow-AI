import React, { useState } from "react";
import { userSignup } from "../../lib/api";
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import SEO from '../common/SEO';

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const username = (form.username as any).value;
    const email = (form.email as any).value;
    const password = (form.password as any).value;
    const confirmPassword = (form.confirmPassword as any).value;

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      setLoading(false);
      return;
    }

    try {
      const data = await userSignup({ username, email, password, confirmPassword });
      if (data && data.user && data.accessToken) {
        login(data.user, data.accessToken);
      }
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Signup failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#07070d] text-white relative overflow-hidden px-4 py-12">
      <SEO 
        title="Create Your Account"
        description="Join NexaFlow AI today. Get instant access to PDF Chat Agent, Excel AI Formula Master, MailCraft AI, and enterprise workflow tools."
        canonical="/signup"
      />
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphic Auth Box */}
      <div className="w-full max-w-md bg-[#121324]/80 backdrop-blur-2xl rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-900/20 p-8 sm:p-10 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent">
              NexaFlow AI
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-1">Create Your Account</h2>
          <p className="text-xs text-gray-400">Get 50 free credits instantly to start exploring AI tools</p>
        </div>

        {/* Signup Form */}
        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 uppercase tracking-wider" htmlFor="username">
              Username
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
                placeholder="choose a username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1b1c33] text-white placeholder-gray-500 border border-gray-700/60 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all text-sm font-medium" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1b1c33] text-white placeholder-gray-500 border border-gray-700/60 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all text-sm font-medium" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="new-password" 
                required 
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1b1c33] text-white placeholder-gray-500 border border-gray-700/60 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all text-sm font-medium" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 uppercase tracking-wider" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                autoComplete="new-password" 
                required 
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1b1c33] text-white placeholder-gray-500 border border-gray-700/60 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all text-sm font-medium" 
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-2 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:from-cyan-400 hover:via-purple-500 hover:to-pink-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              <>
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Redirect */}
        <div className="mt-6 pt-5 border-t border-gray-800 text-center">
          <span className="text-gray-400 text-xs">Already have an account? </span>
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold text-xs hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}