import { Button } from "@/components/ui/button"
import { Users, Zap, TrendingUp, Share2, Shield, CheckCircle2 } from "lucide-react"
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
      description: "Manage shared resources, copy templates, and access permissions in one place.",
      features: ["Unified workspace with shared credit allocations", "No per-user seat fees across your team"],
      icon: Users,
    },
    {
      title: "Integrated Retrieval & Model Access",
      description: "Retrieve documents via self-hosted RAG, powered by Groq and Ollama backends.",
      features: [
        "Groq Cloud API fallback with ~50ms speed",
        "Data privacy using ChromaDB vector collections",
        "Cost-effective local LLM integration paths",
      ],
      icon: Zap,
    },
    {
      title: "On-Demand Resource Allocation",
      description: "Scale your workflows by allocating resources to key project areas as needed.",
      features: [
        "Dynamic credit assignment across members",
        "Automated tools for Excel, PDF, Mail, and Social",
        "Flexible infrastructure with no contract lock-ins",
      ],
      icon: TrendingUp,
    },
    {
      title: "Shared Document Libraries",
      description: "Upload PDFs, reference documents, and marketing assets to team vector stores.",
      features: [
        "Shared vector document indexes for team lookup",
        "Centralized copy frameworks and templates",
        "Collaborative PDF summarization and querying",
      ],
      icon: Share2,
    },
    {
      title: "Security & Infrastructure",
      description: "Host your data securely with JWT authentication and granular document controls.",
      features: [
        "Secure JSON Web Token (JWT) user access control",
        "Open microservices stack for deploy flexibility",
        "Optimized client bundling for instant load speed",
      ],
      icon: Shield,
    },
  ]

  return (
    <section id="interactive-feature-cards" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#050505] relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#2640D9]/5 text-[#8A66E6] border border-[#2640D9]/20">
            <span>Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-white mt-4 font-['Outfit'] tracking-tight">
            Integrated Document & <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8A66E6]">Workspace Automation</span>
          </h2>
          <p className="text-[#737373] text-sm sm:text-base max-w-2xl mx-auto mt-4 font-normal leading-relaxed">
            One platform combining document intelligence, spreadsheet analytics, email copy, and social media automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border border-[#262626] bg-[#0b0b0f] shadow-xl flex flex-col justify-between"
            >
              <div className="p-6 sm:p-8 h-full flex flex-col justify-between">
                <div>
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#2640D9]/5 border border-[#2640D9]/20 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-[#8A66E6]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3 leading-snug font-['Outfit']">{feature.title}</h3>
                  <p className="text-[#737373] text-sm mb-6 leading-relaxed font-normal">{feature.description}</p>

                  {/* Feature Checkmarks */}
                  <div className="space-y-3 border-t border-[#262626] pt-4">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#8A66E6] mt-0.5 flex-shrink-0" />
                        <span className="text-[#E5E5E5] text-xs sm:text-sm font-normal">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <Button
            className="bg-white hover:bg-neutral-200 text-black font-semibold px-10 py-4 text-xs tracking-widest uppercase rounded-full shadow-lg transition-all duration-200 hover:scale-[1.02]"
            onClick={handleGetStarted}
          >
            Launch Your AI Workspace →
          </Button>
        </div>
      </div>
    </section>
  )
}
