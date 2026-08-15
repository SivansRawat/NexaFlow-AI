
export function AboutUs() {
  return (
    <section
      id="about-us"
      className="py-16 sm:py-20 px-4 sm:px-6 bg-[#050505] animate-fade-in-up"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight mb-3 sm:mb-4 text-white font-['Outfit']">
            Who <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8A66E6]">are we?</span>
          </h2>
          <div className="w-12 sm:w-16 h-0.5 bg-[#2640D9] mx-auto"></div>
        </div>
        <div className="bg-[#0b0b0f] rounded-[24px] shadow-2xl p-6 sm:p-8 md:p-10 border border-[#262626] relative overflow-hidden">
          <div className="absolute -top-8 sm:-top-10 -right-8 sm:-right-10 w-32 sm:w-40 h-32 sm:h-40 bg-[#2640D9]/5 rounded-full blur-2xl z-0"></div>
          <div className="relative z-10">
            <p className="text-[#E5E5E5] text-base sm:text-lg md:text-xl leading-relaxed mb-4 sm:mb-6 font-light">
              <span className="font-semibold text-white">NexaFlow AI</span> is India's first all-in-one AI automation platform designed specifically for fast-scaling businesses and professionals. In a world where time is money, we bring you tools that automate repetitive tasks — from Excel analytics and PDF processing to AI-powered chat, email writing, customer replies, and CRM workflows — all in one unified workspace.
            </p>
            <p className="text-[#737373] text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 font-normal">
              Our platform is built to save <span className="text-[#818CF8] font-semibold">1000+ human hours every year</span>, helping businesses reduce operational costs by up to <span className="text-[#C968F7] font-semibold">60%</span>, while managing <span className="text-[#C968F7] font-semibold">10× more workload</span> without hiring extra staff.
            </p>
            <p className="text-[#737373] text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 font-normal">
              Today, over <span className="text-emerald-400 font-semibold">500+ businesses</span> trust NexaFlow AI to streamline their daily operations and boost team productivity.
            </p>
            <p className="text-[#737373] text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 font-normal">
              Behind NexaFlow AI is a dedicated team of developers, designers, and growth-focused minds with over <span className="text-[#818CF8] font-semibold">20+ years</span> of combined experience in software, automation, and business transformation. We're not just building another tool — we're building your AI-powered virtual teammate.
            </p>
            <p className="text-[#737373] text-sm sm:text-base md:text-lg leading-relaxed font-normal">
              We believe AI should be <span className="text-[#818CF8] font-semibold">simple</span>, <span className="text-[#C968F7] font-semibold">affordable</span>, and <span className="text-[#C968F7] font-semibold">accessible</span> — and that's exactly what <span className="font-semibold text-white">NexaFlow AI</span> delivers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


// Render Rating and Feedback after AboutUs
export default function AboutUsWithExtras() {
  return (
    <>
      <AboutUs />
      
    </>
  );
}

// Tailwind animation utility (add to your global CSS if not present):
// .animate-fade-in-up {
//   @apply opacity-0 translate-y-8;
//   animation: fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.1s forwards;
// }
// @keyframes fadeInUp {
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// } 