import { Badge } from "@/components/ui/badge"
import { PayButton } from "@/components/razorpay";
import { useAuth } from "@/context/AuthContext";

export function HeroSection() {
  useAuth();

  return (
    <section id="hero-section" className="py-12 sm:py-16 px-4 sm:px-6 text-center min-h-screen flex items-center justify-center" style={{background: '#18192a'}}>
      <div className="max-w-4xl mx-auto">
        <div className="relative max-w-2xl mx-auto">
          {/* Limited Time Offer Badge - positioned outside the card */}
          <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-gradient-to-r from-purple-500 to-orange-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium">
              Limited Time Offer
            </div>
          </div>
          
          <div className="w-full rounded-3xl shadow-2xl bg-[#18192a] p-6 sm:p-8 md:p-12 pt-12 sm:pt-16 flex flex-col items-center relative overflow-visible" style={{border: '2px solid transparent', backgroundImage: 'linear-gradient(#18192a, #18192a), linear-gradient(135deg, #8b5cf6, #f97316, #8b5cf6)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box'}}>
            
            <div className="mt-2 mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <span className="text-purple-400 font-bold text-xl sm:text-2xl flex items-center leading-none align-middle flex-shrink-0">PRO</span>
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                  NexaFlow AI – Complete Business Automation Suite
                </span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
                All-in-One AI Agent for Your Business
              </p>
            </div>
            
            <div className="text-center mb-2 sm:mb-3">
              <div className="text-sm sm:text-base text-gray-400 line-through">₹50000/month</div>
            </div>
            
            <div className="flex items-end justify-center mb-2 sm:mb-3">
              <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-400">
                ₹5666/month
              </span>
            </div>
            
            <div className="text-sm sm:text-base text-gray-400 mb-2 sm:mb-3">Forever • No hidden costs</div>
            
            <div className="mb-4 sm:mb-6">
              <Badge className="bg-green-900/50 text-green-400 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-green-500/30">
                Save ₹50,000
              </Badge>
            </div>

            {/* CTA Button */}
            <div className="w-full mb-4 sm:mb-6">
              <PayButton />
            </div>
            
            {/* Features List */}
            <div className="w-full max-w-lg mx-auto">
              <ul className="text-left space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg">
                <li className="flex items-start gap-2 sm:gap-3 text-gray-300 pb-2 sm:pb-3 border-b border-gray-700/50">
                  <span className="text-purple-400 text-lg sm:text-xl mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>AI-Powered Excel Automation — Cut hours of manual spreadsheet work</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-gray-300 pb-2 sm:pb-3 border-b border-gray-700/50">
                  <span className="text-purple-400 text-lg sm:text-xl mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>PDF Data Extraction — Upload and get clean data instantly</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-gray-300 pb-2 sm:pb-3 border-b border-gray-700/50">
                  <span className="text-purple-400 text-lg sm:text-xl mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>Bulk Email & Chat Writers — Craft 100s of emails/chats in seconds</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-gray-300 pb-2 sm:pb-3 border-b border-gray-700/50">
                  <span className="text-purple-400 text-lg sm:text-xl mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>WhatsApp & CRM Auto-Replies — Respond instantly, 24/7</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-gray-300 pb-2 sm:pb-3 border-b border-gray-700/50">
                  <span className="text-purple-400 text-lg sm:text-xl mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>Custom Reports & Analytics — Track your KPIs with zero effort</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-gray-300 pb-2 sm:pb-3 border-b border-gray-700/50">
                  <span className="text-purple-400 text-lg sm:text-xl mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>Save 1000+ Hours/Year — Replace manual tasks with AI</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-gray-300 pb-2 sm:pb-3 border-b border-gray-700/50">
                  <span className="text-purple-400 text-lg sm:text-xl mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>Scale Without Hiring — Automate ops, cut HR costs</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-gray-300 pb-2 sm:pb-3 border-b border-gray-700/50">
                  <span className="text-purple-400 text-lg sm:text-xl mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>Unlimited Access to GPT-4o, Claude, Gemini Pro</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-gray-300">
                  <span className="text-purple-400 text-lg sm:text-xl mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>All-in-One Dashboard — Access everything, no switching tabs</span>
                </li>
              </ul>
              <div className="mt-6 sm:mt-8 text-center text-gray-400 text-xs sm:text-sm">
                <span className="mr-1 sm:mr-2">✓ No credit card required</span>
                <span className="mx-1 sm:mx-2">•</span>
                <span className="mr-1 sm:mr-2">✓ Instant access</span>
                <span className="mx-1 sm:mx-2">•</span>
                <span>✓ Cancel anytime</span>
              </div>
            </div>
            
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-orange-900/5 rounded-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
}