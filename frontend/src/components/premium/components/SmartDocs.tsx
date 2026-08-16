import React from 'react';
import ToolCard from './ToolCard';
import { FileCheck, FileText } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SEO from '../../common/SEO';

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
      onClick: () => navigate('/premium/smartdocs/smartinvoice'),
    },
    {
      title: 'Offer Letter Composer',
      description: 'Compose customized employment offer letters, compensation terms, and legal clauses.',
      icon: FileText,
      gradient: 'from-purple-500 to-indigo-500',
      onClick: () => navigate('/premium/smartdocs/offerletter'),
    }
  ];

  return (
    <div className="space-y-8 w-full pt-2 pb-12">
      <SEO 
        title="SmartDocs - Intelligent Document Automation Suite"
        description="Automate essential business documentation. Create custom invoices, job offer letters, contracts, and legal templates with AI."
        canonical="/premium/smartdocs"
      />
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-[#2640D9]/20 bg-[#0b0b0f] shadow-xl shadow-black/40">
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl font-light tracking-tight text-white font-['Inter']">
            SmartDocs Suite
          </h1>
          <p className="text-xs max-w-2xl leading-relaxed text-[#737373] font-normal">
            Generate corporate contracts, offer letters, and invoice structures.
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