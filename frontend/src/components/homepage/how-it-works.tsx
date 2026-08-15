import { CheckCircle, MessageCircle, Bot, Database } from 'lucide-react';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 bg-[#050505] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#2640D9]/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8A66E6]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-16 relative z-10">
        {/* Left: Headline and Steps */}
        <div className="flex-1 min-w-0 w-full lg:min-w-[340px]">
          <span className="text-xs sm:text-sm uppercase tracking-widest text-[#8A66E6] font-bold">Workflow Engine</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight mb-8 text-white tracking-tight mt-2 font-['Outfit']">
            How <span className="font-semibold bg-gradient-to-r from-white via-[#8A66E6] to-[#6633E6] bg-clip-text text-transparent">NexaFlow AI</span> Delivers Results
          </h2>

          <ul className="space-y-6">
            <li className="flex items-start gap-4 p-4 rounded-2xl bg-[#0b0b0f] border border-[#262626] hover:border-[#2640D9]/30 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-[#2640D9]/10 border border-[#2640D9]/30 flex items-center justify-center flex-shrink-0 text-[#2640D9]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-base sm:text-lg mb-0.5 font-['Outfit']">1. Enter Your Task Prompt</div>
                <div className="text-[#737373] text-xs sm:text-sm font-normal">Specify your request — from lead email generation to complex Excel analysis or PDF extraction.</div>
              </div>
            </li>

            <li className="flex items-start gap-4 p-4 rounded-2xl bg-[#0b0b0f] border border-[#262626] hover:border-[#8A66E6]/30 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-[#8A66E6]/10 border border-[#8A66E6]/30 flex items-center justify-center flex-shrink-0 text-[#8A66E6]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-base sm:text-lg mb-0.5 font-['Outfit']">2. RAG Vector Knowledge Retrieval</div>
                <div className="text-[#737373] text-xs sm:text-sm font-normal">ChromaDB retrieves top matching vector templates & document chunks instantly.</div>
              </div>
            </li>

            <li className="flex items-start gap-4 p-4 rounded-2xl bg-[#0b0b0f] border border-[#262626] hover:border-[#6633E6]/30 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-[#6633E6]/10 border border-[#6633E6]/30 flex items-center justify-center flex-shrink-0 text-[#6633E6]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-base sm:text-lg mb-0.5 font-['Outfit']">3. High-Speed Hybrid LLM Synthesis</div>
                <div className="text-[#737373] text-xs sm:text-sm font-normal">Groq Cloud LLM (~50ms) + Ollama generates structured outputs guided by RAG context.</div>
              </div>
            </li>

            <li className="flex items-start gap-4 p-4 rounded-2xl bg-[#0b0b0f] border border-[#2640D9]/20 bg-[#2640D9]/5 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-[#2640D9]/10 border border-[#2640D9]/30 flex items-center justify-center flex-shrink-0 text-[#2640D9]">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-base sm:text-lg mb-0.5 font-['Outfit']">4. Instant Ready-to-Use Output</div>
                <div className="text-[#737373] text-xs sm:text-sm font-normal">Delivers clean formatted emails, formulas, social posts, or JSON data 10× faster.</div>
              </div>
            </li>
          </ul>
        </div>

        {/* Right: Interactive Browser Mockup */}
        <div className="flex-1 flex justify-center w-full">
          <div className="w-full max-w-lg lg:max-w-xl bg-[#0b0b0f] rounded-2xl shadow-2xl border border-[#262626] overflow-hidden relative">
            {/* Browser Top Bar */}
            <div className="flex items-center px-4 py-3 bg-[#0e0e14] border-b border-[#262626]">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 mr-2"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 mr-2"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 mr-4"></div>
              <div className="flex-1 bg-black/40 rounded-full px-3 py-1 text-[10px] text-[#737373] font-mono truncate border border-[#262626]">
                https://nexaflow-ai.vercel.app/agent
              </div>
            </div>

            {/* Chat Content */}
            <div className="p-6 space-y-4 bg-[#050505]/40">
              {/* Agent Badge */}
              <div className="flex items-center gap-3 pb-3 border-b border-[#262626]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2640D9] to-[#8A66E6] flex items-center justify-center text-white font-bold text-sm shadow-md">
                  N
                </div>
                <div>
                  <span className="text-white font-bold text-sm block">NexaFlow AI Engine</span>
                  <span className="text-xs text-[#8A66E6] flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8A66E6] animate-pulse" />
                    RAG Vector Engine Active (~47ms)
                  </span>
                </div>
              </div>

              {/* User Prompt */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#262626] border border-[#2640D9]/30 flex items-center justify-center text-[#E5E5E5] font-bold text-xs shadow-md">
                  U
                </div>
                <div className="bg-[#0b0b0f] rounded-2xl p-3 text-[#E5E5E5] text-xs sm:text-sm border border-[#262626] max-w-[85%]">
                  Write a cold sales email for CTOs with AIDA copywriting structure.
                </div>
              </div>

              {/* RAG Context Retrieval Bubble */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2640D9]/20 border border-[#2640D9]/30 flex items-center justify-center text-[#8A66E6] font-bold text-xs shadow-md">
                  R
                </div>
                <div className="bg-[#2640D9]/5 rounded-2xl p-3 text-[#8A66E6] text-xs border border-[#2640D9]/20 max-w-[85%] font-mono">
                  Retrieved RAG Template: AIDA Framework (Rank 1, Distance: 0.89)
                </div>
              </div>

              {/* AI Completion Bubble */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6633E6]/20 border border-[#6633E6]/30 flex items-center justify-center text-[#6633E6] font-bold text-xs shadow-md">
                  A
                </div>
                <div className="bg-[#6633E6]/5 rounded-2xl p-3.5 text-[#E5E5E5] text-xs sm:text-sm border border-[#6633E6]/20 max-w-[85%] space-y-1.5">
                  <div className="font-bold text-[#6633E6]">Subject: Quick question regarding software automation</div>
                  <div className="font-light text-[#737373]">Hi [Name], noticed your team's growth. Most CTOs struggle with manual PDF & Excel tasks...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
