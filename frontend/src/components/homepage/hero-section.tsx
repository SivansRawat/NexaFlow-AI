import { Badge } from "@/components/ui/badge"
import { PayButton } from "@/components/razorpay";
import { useAuth } from "@/context/AuthContext";

export function HeroSection() {
  useAuth();

  return (
    <section id="hero-section" className="py-16 sm:py-24 px-4 sm:px-6 text-center min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="max-w-4xl mx-auto w-full">
        <div className="relative max-w-2xl mx-auto">
          {/* Limited Time Offer Badge - positioned outside the card */}
          <div className="absolute -top-4 sm:-top-5 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-gradient-to-r from-[#2640D9] to-[#8A66E6] text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase shadow-lg shadow-black/40">
              Limited Time Offer
            </div>
          </div>
          
          <div className="w-full rounded-[24px] shadow-2xl bg-gradient-to-br from-[#2640D9]/30 via-transparent to-[#262626]/50 p-[1px] relative overflow-visible">
            <div className="bg-[#0b0b0f] w-full h-full rounded-[23px] p-6 sm:p-8 md:p-12 pt-12 sm:pt-16 flex flex-col items-center">
              <div className="mt-2 mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extralight mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3 flex-wrap font-['Outfit']">
                  <span className="text-[#6633E6] font-bold text-lg sm:text-xl flex items-center leading-none align-middle tracking-wider">PRO</span>
                  <span className="bg-gradient-to-r from-white via-[#8A66E6] to-[#6633E6] bg-clip-text text-transparent font-semibold">
                    NexaFlow AI Complete Suite
                  </span>
                </h1>
                <p className="text-[#737373] text-xs sm:text-sm font-normal">
                  All-in-One AI Agent for Your Business
                </p>
              </div>
              
              <div className="text-center mb-2 sm:mb-3">
                <div className="text-xs sm:text-sm text-[#737373] line-through">₹50,000/month</div>
              </div>
              
              <div className="flex items-end justify-center mb-2 sm:mb-3">
                <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8A66E6]">
                  ₹5,666/month
                </span>
              </div>
              
              <div className="text-xs sm:text-sm text-[#737373] mb-3">Forever • No hidden costs</div>
              
              <div className="mb-6">
                <Badge className="bg-green-500/10 text-green-400 text-xs px-3.5 py-1.5 rounded-full border border-green-500/20 font-bold uppercase tracking-wider">
                  Save ₹44,334
                </Badge>
              </div>

              {/* CTA Button */}
              <div className="w-full mb-6">
                <PayButton />
              </div>
              
              {/* Features List */}
              <div className="w-full max-w-lg mx-auto">
                <ul className="text-left space-y-3.5 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5 text-[#E5E5E5] pb-3 border-b border-[#262626]">
                    <span className="text-[#8A66E6] text-base font-bold flex-shrink-0">✓</span>
                    <span>AI-Powered Excel Automation — Cut hours of manual spreadsheet work</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#E5E5E5] pb-3 border-b border-[#262626]">
                    <span className="text-[#8A66E6] text-base font-bold flex-shrink-0">✓</span>
                    <span>PDF Data Extraction — Upload and get clean data instantly</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#E5E5E5] pb-3 border-b border-[#262626]">
                    <span className="text-[#8A66E6] text-base font-bold flex-shrink-0">✓</span>
                    <span>Bulk Email & Chat Writers — Craft 100s of emails/chats in seconds</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#E5E5E5] pb-3 border-b border-[#262626]">
                    <span className="text-[#8A66E6] text-base font-bold flex-shrink-0">✓</span>
                    <span>WhatsApp & CRM Auto-Replies — Respond instantly, 24/7</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#E5E5E5] pb-3 border-b border-[#262626]">
                    <span className="text-[#8A66E6] text-base font-bold flex-shrink-0">✓</span>
                    <span>Custom Reports & Analytics — Track your KPIs with zero effort</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#E5E5E5] pb-3 border-b border-[#262626]">
                    <span className="text-[#8A66E6] text-base font-bold flex-shrink-0">✓</span>
                    <span>Save 1,000+ Hours/Year — Replace manual tasks with AI</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#E5E5E5] pb-3 border-b border-[#262626]">
                    <span className="text-[#8A66E6] text-base font-bold flex-shrink-0">✓</span>
                    <span>Scale Without Hiring — Automate ops, cut HR costs</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#E5E5E5] pb-3 border-b border-[#262626]">
                    <span className="text-[#8A66E6] text-base font-bold flex-shrink-0">✓</span>
                    <span>Unlimited Access to GPT-4o, Claude, Gemini Pro</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#E5E5E5]">
                    <span className="text-[#8A66E6] text-base font-bold flex-shrink-0">✓</span>
                    <span>All-in-One Dashboard — Access everything, no switching tabs</span>
                  </li>
                </ul>
                <div className="mt-8 text-center text-[#737373] text-[10px] sm:text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2 flex-wrap">
                  <span>✓ No credit card required</span>
                  <span>•</span>
                  <span>✓ Instant access</span>
                  <span>•</span>
                  <span>✓ Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}