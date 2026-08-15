import React from 'react';
import ToolCard from './ToolCard';
import { Mail, Type, Edit3 } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SEO from '../../common/SEO';

interface MailCraftProps {
  isDarkMode?: boolean;
}

const MailCraft: React.FC<MailCraftProps> = () => {
  const outletContext = useOutletContext<{ isDarkMode?: boolean }>() || {};
  const isDarkMode = outletContext.isDarkMode ?? true;
  const navigate = useNavigate();

  const tools = [
    {
      title: 'Email Wizard',
      description: 'Create high-converting cold, sales, outreach, and HR emails instantly using AI.',
      icon: Mail,
      gradient: 'from-green-500 to-emerald-500',
      onClick: () => navigate('/premium/mailcraft/emailwizard'),
    },
    {
      title: 'Subject Line Optimizer',
      description: 'Generate high-open-rate email subject lines tailored to your target audience.',
      icon: Type,
      gradient: 'from-blue-500 to-cyan-500',
      onClick: () => navigate('/premium/mailcraft/subjectlineoptimizer'),
    },
    {
      title: 'Tone Polisher',
      description: 'Polish email grammar, adjust tone to executive/formal, and increase email impact.',
      icon: Edit3,
      gradient: 'from-purple-500 to-pink-500',
      onClick: () => navigate('/premium/mailcraft/tonepolisher'),
    }
  ];

  return (
    <div className="space-y-8 w-full pt-2 pb-12">
      <SEO 
        title="MailCraft AI - Intelligent Email Copywriting & Outreach"
        description="Craft high-converting cold emails, optimize email subject lines for maximum open rates, and polish email tone with AI."
        canonical="/premium/mailcraft"
      />
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-[#2640D9]/20 bg-[#0b0b0f] shadow-xl shadow-black/40">
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl font-light tracking-tight text-white font-['Inter']">
            MailCraft AI
          </h1>
          <p className="text-xs max-w-2xl leading-relaxed text-[#737373] font-normal">
            Draft outreach templates, optimize subject lines, and refine professional tone.
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

export default MailCraft;