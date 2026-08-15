import React from 'react';
import ToolCard from './ToolCard';
import { FileSpreadsheet, LayoutTemplate, MailCheck } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SEO from '../../common/SEO';

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
      <SEO 
        title="AI Bulk Mailer & Mail Merge Engine"
        description="Launch personalized email campaigns from Excel files, select smart outreach templates, and automate mail merge with AI."
        canonical="/premium/bulkmailer"
      />
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-[#2640D9]/20 bg-[#0b0b0f] shadow-xl shadow-black/40">
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl font-light tracking-tight text-white font-['Inter']">
            BulkMailer Pro
          </h1>
          <p className="text-xs max-w-2xl leading-relaxed text-[#737373] font-normal">
            Upload recipient contacts list, map parameters, and trigger mass email distributions.
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