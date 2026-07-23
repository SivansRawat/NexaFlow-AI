import React from 'react';
import ToolCard from './ToolCard';
import { Share2, Hash, Sparkles, RefreshCw, Megaphone } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SEO from '../../common/SEO';

interface SocialProProps {
  isDarkMode?: boolean;
}

const SocialPro: React.FC<SocialProProps> = () => {
  const outletContext = useOutletContext<{ isDarkMode?: boolean }>() || {};
  const isDarkMode = outletContext.isDarkMode ?? true;
  const navigate = useNavigate();

  const tools = [
    {
      title: 'CaptionPro',
      description: 'Generate viral, engaging social media captions for Instagram, LinkedIn, and Twitter.',
      icon: Share2,
      gradient: 'from-pink-500 to-rose-500',
      onClick: () => navigate('/premium/socialpro/captionpro'),
    },
    {
      title: 'Hashtag Strategist',
      description: 'Discover high-reach trending hashtags and topic keywords tailored to your niche.',
      icon: Hash,
      gradient: 'from-purple-500 to-indigo-500',
      onClick: () => navigate('/premium/socialpro/hashtagstrategist'),
    },
    {
      title: 'Ad Caption Generator',
      description: 'Generate high-converting Facebook, Google, and LinkedIn ad copy instantly.',
      icon: Megaphone,
      gradient: 'from-amber-500 to-orange-500',
      onClick: () => navigate('/premium/socialpro/adcaption'),
    },
    {
      title: 'Caption Rewriter',
      description: 'Remix existing captions to match brand tone, lengthen, or summarize.',
      icon: RefreshCw,
      gradient: 'from-cyan-500 to-blue-500',
      onClick: () => navigate('/premium/socialpro/captionrewriter'),
    }
  ];

  return (
    <div className="space-y-8 w-full pt-2 pb-12">
      <SEO 
        title="SocialPro AI - Viral Social Captions & Ad Copy Generator"
        description="Generate viral social media captions, trending hashtag strategies, high-converting ad copy, and content rewrites with AI."
        canonical="/premium/socialpro"
      />
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-gray-900 border-pink-500/30 shadow-xl shadow-pink-900/10' 
          : 'bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border-pink-200 shadow-lg'
      }`}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Social Growth Suite</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Social Pro Toolkit
          </h1>
          <p className={`text-sm max-w-2xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Accelerate social media growth with viral caption generation, hashtag analytics, and ad copy optimization.
          </p>
        </div>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            gradient={tool.gradient}
            isDarkMode={isDarkMode}
            onClick={tool.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default SocialPro;