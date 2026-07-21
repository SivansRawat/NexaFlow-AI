import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function MainHero() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/premium');
    }
  };

  return (
    <section id="main-hero" className="py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden bg-[#0d0e1a]">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-purple-600/25 to-pink-500/20 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/15 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Background Orbit SVG */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-20" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minHeight: 600 }}>
        <ellipse cx="720" cy="300" rx="600" ry="220" stroke="#a855f7" strokeWidth="1" />
        <ellipse cx="720" cy="300" rx="400" ry="150" stroke="#06b6d4" strokeWidth="1" />
        <ellipse cx="720" cy="300" rx="250" ry="90" stroke="#ec4899" strokeWidth="1" />
      </svg>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Universal RAG Feature Pill Badge */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-full border border-purple-500/30 text-xs sm:text-sm text-cyan-300 font-medium tracking-wide shadow-lg shadow-purple-950/20">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>⚡ Universal RAG Vector Engine & 15+ Enterprise AI Tools</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 sm:mb-8 leading-tight tracking-tight text-white">
          Automate Your Business with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
            Universal RAG & AI Workmates
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4 font-light">
          NexaFlow AI empowers modern teams with self-hosted vector document retrieval, smart email synthesis, Excel analytics, and social media automation — in one unified workspace.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 sm:mb-16">
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-400 hover:via-purple-500 hover:to-pink-500 text-white font-semibold text-base sm:text-lg shadow-lg shadow-purple-900/40 hover:shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Get Started Free</span> 🚀
          </button>
          
          <a
            href="#interactive-feature-cards"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gray-900/80 hover:bg-gray-800/80 border border-gray-700/60 text-gray-200 hover:text-white font-medium text-base sm:text-lg backdrop-blur-md transition-all duration-200 text-center"
          >
            Explore AI Modules
          </a>
        </div>

        {/* Key Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12 px-4">
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-gray-800/60 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">15+</span>
            <span className="text-xs sm:text-sm text-gray-400 mt-1">AI Modules</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-gray-800/60 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">100%</span>
            <span className="text-xs sm:text-sm text-gray-400 mt-1">Vector Privacy</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-gray-800/60 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">~50ms</span>
            <span className="text-xs sm:text-sm text-gray-400 mt-1">Groq LLM Latency</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-gray-800/60 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">10x</span>
            <span className="text-xs sm:text-sm text-gray-400 mt-1">Cost Efficiency</span>
          </div>
        </div>

        {/* Video / Dashboard Showcase */}
        <div className="flex justify-center relative px-2 sm:px-4">
          <div className="relative bg-gradient-to-r from-cyan-500/40 via-purple-600/40 to-pink-500/40 p-[2px] rounded-2xl shadow-2xl shadow-purple-950/50 w-full max-w-4xl transition-all duration-300">
            <div className="rounded-2xl overflow-hidden bg-[#121324] relative w-full aspect-video">
              <video
                src="/vid.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CustomerStoriesSection() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-[#0c0d18] border-t border-gray-800/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm uppercase tracking-widest text-cyan-400 font-semibold">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Trusted by Fast-Growing Teams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
          {/* Story 1 */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-md p-6 sm:p-8 flex flex-col items-center text-center border border-gray-800/80 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl">
            <img src="/customer1.jpg" alt="Sudeep Bansal" className="w-20 sm:w-24 h-20 sm:h-24 rounded-full object-cover mb-4 border-2 border-cyan-400/40 shadow-lg" />
            <div className="font-bold text-lg text-white mb-1">Sudeep Bansal</div>
            <div className="text-xs text-cyan-400 mb-4 font-medium">VP of Wow Skin Science</div>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              "NexaFlow AI helped us automate a major chunk of our backend operations. We believe AI is the future — and with NexaFlow AI, we're already there."
            </p>
          </div>

          {/* Story 2 */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-md p-6 sm:p-8 flex flex-col items-center text-center border border-gray-800/80 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl">
            <img src="/customer2.jpg" alt="Karthik Ranganathan" className="w-20 sm:w-24 h-20 sm:h-24 rounded-full object-cover mb-4 border-2 border-purple-400/40 shadow-lg" />
            <div className="font-bold text-lg text-white mb-1">Karthik Ranganathan</div>
            <div className="text-xs text-purple-400 mb-4 font-medium">Assistant VP, The ThickShake Factory</div>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              "We thought scaling meant hiring more people — until NexaFlow AI replaced our entire backend with automation. Now we run faster, leaner, and smarter."
            </p>
          </div>

          {/* Story 3 */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-md p-6 sm:p-8 flex flex-col items-center text-center border border-gray-800/80 hover:border-pink-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl">
            <img src="/customer3.jpg" alt="Rajat Jaiswal" className="w-20 sm:w-24 h-20 sm:h-24 rounded-full object-cover mb-4 border-2 border-pink-400/40 shadow-lg" />
            <div className="font-bold text-lg text-white mb-1">Rajat Jaiswal</div>
            <div className="text-xs text-pink-400 mb-4 font-medium">Co-founder, Wat-a-Burger</div>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              "NexaFlow AI helped us cut operational expenses by over 70%. We now manage everything without hiring additional staff."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
