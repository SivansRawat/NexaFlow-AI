import React from 'react';
import ToolCard from './ToolCard';
import { Share2, Hash, RefreshCw, Megaphone } from 'lucide-react';
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
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-[#2640D9]/20 bg-[#0b0b0f] shadow-xl shadow-black/40">
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl font-light tracking-tight text-white font-['Inter']">
            Social Pro Toolkit
          </h1>
          <p className="text-xs max-w-2xl leading-relaxed text-[#737373] font-normal">
            Generate social media captions, plan hashtags, and optimize ad copy.
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