import { Button } from "@/components/ui/button"
import { Users, Zap, TrendingUp, Share2, Shield, FileText, ChevronRight } from "lucide-react"
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export function InteractiveFeatureCards() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/premium');
    }
  };

  const features = [
    {
      title: "Shared Workspaces & Access Control",
      description: "Manage team resources, copy templates, and granular permissions in one unified workspace with no per-seat fees.",
      icon: Users,
    },
    {
      title: "Integrated Retrieval & Model Access",
      description: "Retrieve documents via self-hosted RAG, powered by Groq speed and ChromaDB vector collections for absolute privacy.",
      icon: Zap,
    },
    {
      title: "On-Demand Resource Allocation",
      description: "Scale your workflows by dynamically allocating compute and credit resources to key projects as needed.",
      icon: TrendingUp,
    },
    {
      title: "Shared Document Libraries",
      description: "Upload PDFs, reference documents, and corporate assets to shared team vector indexes for instant lookups.",
      icon: Share2,
    },
    {
      title: "Enterprise Security & Privacy",
      description: "Host data securely with JWT authentication, granular document privacy controls, and open deploy flexibility.",
      icon: Shield,
    },
    {
      title: "Automated Document Workflows",
      description: "Generate contracts, offer letters, spreadsheet formulas, and email copy seamlessly with instant exports.",
      icon: FileText,
    },
  ]

  return (
    <section id="interactive-feature-cards" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#030305] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#2640D9]/10 text-[#8A66E6] border border-[#2640D9]/30">
            <span>Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mt-4 font-['Inter'] tracking-tight">
            Integrated Document & <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-[#8A66E6] to-[#2640D9]">Workspace Automation</span>
          </h2>
          <p className="text-[#737373] text-sm sm:text-base max-w-2xl mx-auto mt-4 font-normal leading-relaxed font-['Inter']">
            One platform combining document intelligence, spreadsheet analytics, email copy, and social media automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0f] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 hover:border-[#2640D9]/50 hover:shadow-2xl hover:shadow-[#2640D9]/20"
            >
              {/* Primary Blue Corner Radial Glow (inspired by uploaded image, colored with #2640D9 & #6633E6) */}
              <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#2640D9]/30 rounded-full blur-[70px] pointer-events-none group-hover:bg-[#2640D9]/50 group-hover:scale-110 transition-all duration-500" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-[#6633E6]/25 to-transparent rounded-full blur-[40px] pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  {/* Top Circular Icon Badge */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-b from-white/15 to-white/5 p-[1px] mb-8 shadow-inner flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#121218] flex items-center justify-center border border-white/5 group-hover:border-[#2640D9]/40 transition-colors">
                      <feature.icon className="w-6 h-6 text-white group-hover:text-[#8A66E6] transition-colors" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-medium text-white mb-4 leading-tight tracking-tight font-['Inter']">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#A3A3A3] text-sm sm:text-base leading-relaxed font-light font-['Inter'] mb-8">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Action Link ('Learn more >') */}
                <div className="pt-2">
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex items-center gap-1.5 text-sm font-normal text-white group-hover:text-[#8A66E6] transition-colors duration-200"
                  >
                    <span>Learn more</span>
                    <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-[#8A66E6] group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <Button
            className="bg-white hover:bg-neutral-200 text-black font-medium px-10 py-4 text-xs tracking-widest uppercase rounded-full shadow-lg transition-all duration-200 hover:scale-[1.02] font-['Inter']"
            onClick={handleGetStarted}
          >
            Launch Your AI Workspace →
          </Button>
        </div>
      </div>
    </section>
  )
}
