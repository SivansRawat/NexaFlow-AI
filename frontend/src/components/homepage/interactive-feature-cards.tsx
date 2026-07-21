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
      badge: "Team Workspace",
      title: "Empower Your Whole Team with Cutting-Edge AI",
      description: "Shared workspace & credit pools for seamless team productivity.",
      features: ["Unlimited users with shared credit pool", "Zero per-user seat fees across your team"],
      borderColor: "border-cyan-500/40 hover:shadow-cyan-500/20",
      icon: Users,
      iconBg: "from-cyan-500 to-blue-600",
      badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    },
    {
      badge: "Multi-Model Intelligence",
      title: "Universal RAG & High-Speed Cloud LLMs",
      description: "Access Groq Cloud LLM (~50ms) + Local Ollama + ChromaDB Vector RAG.",
      features: [
        "Groq Cloud API fallback with ~50ms speed",
        "100% Data Privacy with ChromaDB Vector Store",
        "10x more cost-effective than public cloud APIs",
      ],
      borderColor: "border-purple-500/40 hover:shadow-purple-500/20",
      icon: Zap,
      iconBg: "from-purple-500 to-indigo-600",
      badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    },
    {
      badge: "Scalable Growth",
      title: "Flexible AI Power for Growing Businesses",
      description: "Add team members and AI tool suites anytime.",
      features: [
        "Add unlimited team members with zero lock-in",
        "Automate PDF, MailCraft, SocialPro & Excel",
        "Ideal for startups to mid-sized enterprises",
      ],
      borderColor: "border-pink-500/40 hover:shadow-pink-500/20",
      icon: TrendingUp,
      iconBg: "from-pink-500 to-rose-600",
      badgeBg: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    },
    {
      badge: "Collaborative RAG",
      title: "Collaborate Smarter with Shared Vector Knowledge",
      description: "Pool documents and copywriting templates into shared vector stores.",
      features: [
        "Shared vector template library across teams",
        "Pooled credit resources for key projects",
        "Collaborative PDF Brain document chat",
      ],
      borderColor: "border-emerald-500/40 hover:shadow-emerald-500/20",
      icon: Share2,
      iconBg: "from-emerald-500 to-teal-600",
      badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      badge: "Enterprise Security",
      title: "Future-Proof Your Business Risk-Free",
      description: "Stay ahead with enterprise encryption and vector privacy.",
      features: [
        "Enterprise JWT authentication & vector privacy",
        "No vendor lock-in with open microservices",
        "Instant deployment on Vercel & Render",
      ],
      borderColor: "border-amber-500/40 hover:shadow-amber-500/20",
      icon: Shield,
      iconBg: "from-amber-500 to-orange-600",
      badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
  ]

  return (
    <section id="interactive-feature-cards" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#0a0b16] relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs sm:text-sm uppercase tracking-widest text-cyan-400 font-semibold">Features & Capabilities</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-2">
            Unleash Enterprise AI Across Your Entire Team
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mt-3 font-light">
            One platform combining document intelligence, spreadsheet analytics, email copy, and social media automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border ${feature.borderColor} p-6 sm:p-8 transition-all duration-300 transform hover:-translate-y-1.5 shadow-xl flex flex-col justify-between`}
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.iconBg}`} />

              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center shadow-lg shadow-purple-950/30`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${feature.badgeBg}`}>
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 leading-snug">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed font-light">{feature.description}</p>

                {/* Feature Checkmarks */}
                <div className="space-y-3 mb-6 border-t border-gray-800/60 pt-4">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-xs sm:text-sm font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <Button
            className="bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-400 hover:via-purple-500 hover:to-pink-500 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300"
            onClick={handleGetStarted}
          >
            Launch Your AI Workspace →
          </Button>
        </div>
      </div>
    </section>
  )
}
