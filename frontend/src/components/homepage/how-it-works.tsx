import { CheckCircle, MessageCircle, Bot, Database } from 'lucide-react';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 bg-[#0a0b16] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-16 relative z-10">
        {/* Left: Headline and Steps */}
        <div className="flex-1 min-w-0 w-full lg:min-w-[340px]">
          <span className="text-xs sm:text-sm uppercase tracking-widest text-cyan-400 font-semibold">Workflow Engine</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-white tracking-tight mt-2">
            How <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">NexaFlow AI</span> Delivers Results
          </h2>

          <ul className="space-y-6">
            <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-gray-800/80 hover:border-cyan-500/30 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-base sm:text-lg mb-0.5">1. Enter Your Task Prompt</div>
                <div className="text-gray-400 text-xs sm:text-sm font-light">Specify your request — from lead email generation to complex Excel analysis or PDF extraction.</div>
              </div>
            </li>

            <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-gray-800/80 hover:border-purple-500/30 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-purple-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-base sm:text-lg mb-0.5">2. RAG Vector Knowledge Retrieval</div>
                <div className="text-gray-400 text-xs sm:text-sm font-light">ChromaDB retrieves top matching vector templates & document chunks instantly.</div>
              </div>
            </li>

            <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-gray-800/80 hover:border-pink-500/30 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center flex-shrink-0 text-pink-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-base sm:text-lg mb-0.5">3. High-Speed Hybrid LLM Synthesis</div>
                <div className="text-gray-400 text-xs sm:text-sm font-light">Groq Cloud LLM (~50ms) + Ollama generates structured outputs guided by RAG context.</div>
              </div>
            </li>

            <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-emerald-500/30 bg-emerald-500/5 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-base sm:text-lg mb-0.5">4. Instant Ready-to-Use Output</div>
                <div className="text-gray-400 text-xs sm:text-sm font-light">Delivers clean formatted emails, formulas, social posts, or JSON data 10× faster.</div>
              </div>
            </li>
          </ul>
        </div>

        {/* Right: Interactive Browser Mockup */}
        <div className="flex-1 flex justify-center w-full">
          <div className="w-full max-w-lg lg:max-w-xl bg-[#121324] rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden relative">
            {/* Browser Top Bar */}
            <div className="flex items-center px-4 py-3 bg-[#1a1b30] border-b border-gray-800/80">
              <div className="w-3 h-3 rounded-full bg-red-500/80 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80 mr-4"></div>
              <div className="flex-1 bg-black/40 rounded-md px-3 py-1 text-xs text-gray-400 font-mono truncate border border-gray-800">
                https://nexaflow-ai.vercel.app/agent
              </div>
            </div>

            {/* Chat Content */}
            <div className="p-6 space-y-4 bg-[#121324]">
              {/* Agent Badge */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-800/60">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  N
                </div>
                <div>
                  <span className="text-white font-bold text-sm block">NexaFlow AI Engine</span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    RAG Vector Engine Active (~47ms)
                  </span>
                </div>
              </div>

              {/* User Prompt */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  U
                </div>
                <div className="bg-[#1a1b32] rounded-2xl p-3 text-gray-200 text-xs sm:text-sm border border-gray-800 max-w-[85%]">
                  Write a cold sales email for CTOs with AIDA copywriting structure.
                </div>
              </div>

              {/* RAG Context Retrieval Bubble */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  R
                </div>
                <div className="bg-cyan-950/40 rounded-2xl p-3 text-cyan-300 text-xs border border-cyan-500/30 max-w-[85%] font-mono">
                  🔍 Retrieved RAG Template: AIDA Framework (Rank 1, Distance: 0.89)
                </div>
              </div>

              {/* AI Completion Bubble */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  A
                </div>
                <div className="bg-emerald-950/30 rounded-2xl p-3.5 text-emerald-200 text-xs sm:text-sm border border-emerald-500/30 max-w-[85%] space-y-1.5">
                  <div className="font-bold text-emerald-300">Subject: Quick question regarding software automation</div>
                  <div className="font-light">Hi [Name], noticed your team's growth. Most CTOs struggle with manual PDF & Excel tasks...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
