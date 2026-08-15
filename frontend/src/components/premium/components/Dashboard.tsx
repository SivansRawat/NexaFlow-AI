import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  FileText, 
  MessageSquare, 
  FileCheck, 
  Mail, 
  Share2, 
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import SEO from '../../common/SEO';

interface DashboardProps {
  searchQuery?: string;
  isDarkMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ searchQuery = '' }) => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  useAuth();
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full items-start justify-start animate-pulse pt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`rounded-2xl p-6 border ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-gray-200/60 border-gray-200'} h-64`}></div>
        ))}
      </div>
    );
  }

  const handleSuiteClick = (path: string) => {
    navigate(path);
  };

  const toolSuites = [
    {
      title: 'Excel Genius Suite',
      description: 'Smart automated spreadsheet analysis, formula generation, and error detection.',
      icon: FileSpreadsheet,
      badge: 'Excel AI',
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      path: '/premium/excel',
      tools: [
        'Chart Builder Pro',
        'AI Sheet Summarizer', 
        'Formula Master (Write + Explain)',
        'Error & Trend Detector',
        'Excel Export Wizard'
      ]
    },
    {
      title: 'PDF Intelligence Hub',
      description: 'Converse directly with documents, summarize long PDFs, and extract structured tables.',
      icon: FileText,
      badge: 'RAG Powered',
      gradient: 'from-purple-500 to-indigo-600',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      path: '/premium/pdfhub',
      tools: [
        'PDF Brain (Summarizer)',
        'PDF Chat Agent (Ask your PDF)',
        'Smart Data Extractor',
        'PDF Converter Pro (Word/Excel)',
        'Bulk PDF Toolkit'
      ]
    },
    {
      title: 'AI Workmate',
      description: 'Conversational ChatGPT-level AI assistant for workflow automation & writing.',
      icon: MessageSquare,
      badge: 'Assistant',
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      path: '/premium/aiworkmate',
      tools: [
        'AI Agent (ChatGPT Level)',
        'Smart Email Drafter',
        'Resume Evaluator & Enhancer',
        'Product Description Pro',
        'Marketing Copy Generator'
      ]
    },
    {
      title: 'MailCraft AI',
      description: 'Professional email generator, subject line optimizer, and tone polisher.',
      icon: Mail,
      badge: 'Email Suite',
      gradient: 'from-cyan-500 to-blue-600',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      path: '/premium/mailcraft',
      tools: [
        'Email Wizard',
        'Subject Line Optimizer',
        'Tone Polisher'
      ]
    },
    {
      title: 'Social Pro Toolkit',
      description: 'Generate viral social media captions, hashtag strategies, and ad copy.',
      icon: Share2,
      badge: 'Marketing',
      gradient: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      path: '/premium/socialpro',
      tools: [
        'CaptionPro',
        'Hashtag Strategist',
        'Ad Caption Generator',
        'Caption Rewriter'
      ]
    },
    {
      title: 'SmartDocs Generator',
      description: 'Automated contract, offer letter, and smart invoice composition tools.',
      icon: FileCheck,
      badge: 'Document AI',
      gradient: 'from-fuchsia-500 to-purple-600',
      iconBg: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
      path: '/premium/smartdocs',
      tools: [
        'Smart Invoice Builder',
        'Offer Letter Composer'
      ]
    }
  ];

  // Filter tool suites based on search query
  const filteredToolSuites = toolSuites.filter(suite => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const titleMatch = suite.title.toLowerCase().includes(query);
    const descriptionMatch = suite.description.toLowerCase().includes(query);
    const toolsMatch = suite.tools.some(tool => tool.toLowerCase().includes(query));
    
    return titleMatch || descriptionMatch || toolsMatch;
  });

  return (
    <div className="space-y-8 pt-2 pb-12">
      <SEO 
        title="AI Suite Workspace Dashboard"
        description="Access all NexaFlow AI tools in one central workspace: Excel Suite, PDF Hub, MailCraft AI, SocialPro AI, SmartDocs, and AI Workmate."
        canonical="/premium"
      />
      {/* Welcome Hero Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-[#0b0b0f] border-[#262626] shadow-xl shadow-black/40' 
          : 'bg-white border-gray-200 shadow-md'
      }`}>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className={`text-2xl font-light tracking-tight font-['Inter'] ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Workspace Dashboard
            </h1>
            <p className={`text-xs max-w-2xl leading-relaxed font-normal ${isDarkMode ? 'text-[#737373]' : 'text-gray-600'}`}>
              Access active automation tools, document hubs, and analytics pipelines.
            </p>
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-center">
          <p className={`text-sm ${isDarkMode ? 'text-[#737373]' : 'text-gray-500'}`}>
            {filteredToolSuites.length > 0 
              ? `Found ${filteredToolSuites.length} tool suite${filteredToolSuites.length !== 1 ? 's' : ''} matching "${searchQuery}"`
              : `No results found for "${searchQuery}"`}
          </p>
        </div>
      )}

      {/* Tool Suites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredToolSuites.map((suite) => (
          <div 
            key={suite.title}
            className={`group relative rounded-2xl p-[1px] transition-all duration-300 cursor-pointer flex flex-col justify-between transform hover:-translate-y-1 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-[#2640D9]/25 via-transparent to-[#262626]/40 hover:shadow-2xl hover:shadow-[#2640D9]/10' 
                : 'bg-white border border-gray-200 hover:border-purple-300 hover:shadow-xl'
            }`}
            onClick={() => handleSuiteClick(suite.path)}
          >
            <div className={`p-6 rounded-[15px] h-full flex flex-col justify-between ${isDarkMode ? 'bg-[#0b0b0f] text-[#E5E5E5]' : 'bg-white text-gray-900'}`}>
              {/* Top Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-[#2640D9]/20 bg-[#2640D9]/5 text-[#8A66E6]">
                    <suite.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-full border ${
                    isDarkMode ? 'bg-[#050505] text-[#8A66E6] border-[#2640D9]/20' : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {suite.badge}
                  </span>
                </div>

                <h3 className={`font-semibold text-lg mb-2 group-hover:text-[#2640D9] transition-colors font-['Outfit'] ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {suite.title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed mb-5 ${
                  isDarkMode ? 'text-[#737373]' : 'text-gray-600'
                }`}>
                  {suite.description}
                </p>

                {/* Tools List */}
                <div className="space-y-2 mb-6">
                  {suite.tools.map((tool, toolIndex) => (
                    <div 
                      key={toolIndex}
                      className={`flex items-center space-x-2.5 ${
                        isDarkMode ? 'text-[#E5E5E5]' : 'text-gray-700'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2640D9] flex-shrink-0" />
                      <span className="text-xs font-normal">
                        {tool}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className={`pt-4 border-t ${isDarkMode ? 'border-[#262626]' : 'border-gray-100'}`}>
                <button className={`w-full py-2.5 px-4 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md ${
                  isDarkMode 
                    ? 'bg-[#2640D9]/10 border border-[#2640D9]/30 hover:bg-[#2640D9] text-white' 
                    : 'bg-gray-900 hover:bg-purple-600 text-white'
                }`}>
                  <span>Launch Suite</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;