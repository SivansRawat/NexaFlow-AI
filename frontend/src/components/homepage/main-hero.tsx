import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { WebGLWaveBackground } from "./WebGLWaveBackground";

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
    <section id="main-hero" className="py-24 sm:py-32 px-6 sm:px-8 relative overflow-hidden bg-transparent">
      {/* WebGL Technical Dot-Matrix meditative background */}
      <WebGLWaveBackground />

      {/* Volumetric ambient highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-[#2640D9]/15 via-[#6633E6]/10 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.1] lg:leading-[72px] tracking-tight lg:tracking-[-0.025em] text-white font-['Inter']">
          Automate Your Business with <br className="hidden sm:inline" />
          <span className="font-normal bg-gradient-to-r from-white via-[#8A66E6] to-[#2640D9] bg-clip-text text-transparent drop-shadow-sm">
            Universal RAG & AI Workmates
          </span>
        </h1>

        <p className="text-sm sm:text-base text-white/60 mb-10 max-w-3xl mx-auto leading-6 px-4 font-extralight font-['Inter']">
          NexaFlow AI empowers modern teams with self-hosted vector document retrieval, smart email synthesis, Excel analytics, and social media automation — in one unified workspace.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-28 font-['Inter']">
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-medium text-sm tracking-normal transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-white/5"
          >
            <span>Get Started Free</span>
          </button>
          
          <a
            href="#interactive-feature-cards"
            className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#030305]/40 hover:bg-[#2640D9]/10 border border-white/10 hover:border-[#2640D9]/40 text-white font-medium text-sm tracking-normal backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] text-center"
          >
            Explore AI Modules
          </a>
        </div>

        {/* Showcase Dashboard Video - Razor-sharp minimalist frame */}
        <div className="flex justify-center relative px-2 sm:px-4">
          <div className="w-full max-w-4xl p-[1px] bg-white/10 shadow-2xl shadow-black/80">
            <div className="overflow-hidden bg-[#030305] relative w-full aspect-video">
              <video
                src="/vid.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
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
