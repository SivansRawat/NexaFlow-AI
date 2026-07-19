import React from 'react';
import ToolCard from './ToolCard';
import { FileSpreadsheet, LayoutTemplate, Sparkles, MailCheck } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

interface BulkMailerProps {
  isDarkMode?: boolean;
}

const BulkMailer: React.FC<BulkMailerProps> = () => {
  const outletContext = useOutletContext<{ isDarkMode?: boolean }>() || {};
  const isDarkMode = outletContext.isDarkMode ?? true;
  const navigate = useNavigate();

  const tools = [
    {
      title: 'Excel to Email Engine',
      description: 'Import contacts directly from Excel files and launch personalized email campaigns.',
      icon: FileSpreadsheet,
      gradient: 'from-emerald-500 to-teal-500',
      onClick: () => navigate('/premium/bulkmailer/excel-engine'),
    },
    {
      title: 'Smart Template Library',
      description: 'Choose pre-built outreach templates with liquid tags for dynamic personalization.',
      icon: LayoutTemplate,
      gradient: 'from-blue-500 to-indigo-500',
      onClick: () => navigate('/premium/bulkmailer/smarttemplates'),
    },
    {
      title: 'Mail Merge AI',
      description: 'AI-assisted mail merge engine with automated variables and delivery scheduling.',
      icon: MailCheck,
      gradient: 'from-purple-500 to-pink-500',
      onClick: () => navigate('/premium/bulkmailer/mailmergeai'),
    }
  ];

  return (
    <div className="space-y-8 w-full pt-2 pb-12">
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-gray-900 border-blue-500/30 shadow-xl shadow-blue-900/10' 
          : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border-blue-200 shadow-lg'
      }`}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campaign Outreach Engine</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            BulkMailer Pro
          </h1>
          <p className={`text-sm max-w-2xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Mass email automation powered by spreadsheet contact parsing, smart templates, and mail merge AI.
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

export default BulkMailer;