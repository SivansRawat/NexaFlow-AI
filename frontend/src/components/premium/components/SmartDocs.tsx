import React from 'react';
import ToolCard from './ToolCard';
import { FileCheck, FileText, Sparkles } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

interface SmartDocsProps {
  isDarkMode?: boolean;
}

const SmartDocs: React.FC<SmartDocsProps> = () => {
  const outletContext = useOutletContext<{ isDarkMode?: boolean }>() || {};
  const isDarkMode = outletContext.isDarkMode ?? true;
  const navigate = useNavigate();

  const tools = [
    {
      title: 'Smart Invoice Builder',
      description: 'Generate professional business invoices, tax calculations, and line item tables.',
      icon: FileCheck,
      gradient: 'from-emerald-500 to-teal-500',
      onClick: () => navigate('/smartdocs/smartinvoice'),
    },
    {
      title: 'Offer Letter Composer',
      description: 'Compose customized employment offer letters, compensation terms, and legal clauses.',
      icon: FileText,
      gradient: 'from-purple-500 to-indigo-500',
      onClick: () => navigate('/smartdocs/offerletter'),
    }
  ];

  return (
    <div className="space-y-8 w-full pt-2 pb-12">
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-fuchsia-950/40 via-purple-950/30 to-gray-900 border-fuchsia-500/30 shadow-xl shadow-fuchsia-900/10' 
          : 'bg-gradient-to-r from-fuchsia-50 via-purple-50 to-pink-50 border-fuchsia-200 shadow-lg'
      }`}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Business Document Automation</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            SmartDocs Generator
          </h1>
          <p className={`text-sm max-w-2xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Automate invoices, legal agreements, and corporate offer letters with instant PDF output.
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

export default SmartDocs;