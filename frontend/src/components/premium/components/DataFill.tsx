import React from 'react';
import ToolCard from './ToolCard';
import { Database, FileSpreadsheet, Table, Sparkles } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import SEO from '../../common/SEO';

interface DataFillProps {
  isDarkMode?: boolean;
}

const DataFill: React.FC<DataFillProps> = () => {
  const outletContext = useOutletContext<{ isDarkMode?: boolean }>() || {};
  const isDarkMode = outletContext.isDarkMode ?? false;
  const tools = [
    {
      title: 'Auto Form Filler',
      description: 'Automatically fill forms with Excel data',
      icon: Database,
      gradient: 'bg-gradient-to-r from-indigo-500 to-blue-500',
    },
    {
      title: 'Excel-to-Form Mapper',
      description: 'Map Excel columns to form fields',
      icon: FileSpreadsheet,
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-500',
    },
    {
      title: 'Structured Data Extractor',
      description: 'Extract and structure data from documents',
      icon: Table,
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
    {
      title: 'AI Data Cleanser',
      description: 'Clean and validate data automatically',
      icon: Sparkles,
      gradient: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="space-y-6 w-full">
      <SEO 
        title="DataFill AI - Automated Form & Spreadsheet Engine"
        description="Automate form filling, map Excel columns, extract structured data, and clean datasets automatically with AI."
        canonical="/premium/datafill"
      />
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-[#2640D9]/20 bg-[#0b0b0f] shadow-xl shadow-black/40 mb-8">
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl font-light tracking-tight text-white font-['Inter']">
            DataFill AI
          </h1>
          <p className="text-xs max-w-2xl leading-relaxed text-[#737373] font-normal">
            Ingest raw datasets, map matching columns, and resolve form schemas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full items-start justify-start">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            gradient={tool.gradient}
            isDarkMode={isDarkMode}
            onClick={() => console.log(`Opening ${tool.title}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default DataFill;