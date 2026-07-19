import React from 'react';
import ToolCard from './ToolCard';
import { Mail, Type, Edit3, Sparkles } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

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
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-gray-900 border-cyan-500/30 shadow-xl shadow-cyan-900/10' 
          : 'bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 border-cyan-200 shadow-lg'
      }`}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Email Automation Suite</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            MailCraft AI
          </h1>
          <p className={`text-sm max-w-2xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Craft persuasive sales emails, generate click-worthy subject lines, and refine message tone with AI precision.
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