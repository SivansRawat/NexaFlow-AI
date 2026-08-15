import React from 'react';
import ToolCard from './ToolCard';
import { FileText, MessageSquare, FileDown, Package, Database } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SEO from '../../common/SEO';

interface PDFHubProps {
  isDarkMode?: boolean;
}

const PDFHub: React.FC<PDFHubProps> = () => {
  const outletContext = useOutletContext<{ isDarkMode?: boolean }>() || {};
  const isDarkMode = outletContext.isDarkMode ?? true;
  const navigate = useNavigate();

  const tools = [
    {
      title: 'PDF Brain',
      description: 'Intelligent PDF summarization, executive summaries, and key point extraction.',
      icon: FileText,
      gradient: 'from-purple-500 to-indigo-500',
      onClick: () => navigate('/premium/pdfhub/brain'),
    },
    {
      title: 'PDF Chat Agent',
      description: 'Ask questions directly to your PDF documents powered by self-hosted RAG.',
      icon: MessageSquare,
      gradient: 'from-blue-500 to-cyan-500',
      onClick: () => navigate('/premium/pdfhub/chatagent'),
    },
    {
      title: 'Smart Data Extractor',
      description: 'Extract structured tables, key-value data, and metadata from PDFs automatically.',
      icon: Database,
      gradient: 'from-green-500 to-teal-500',
      onClick: () => navigate('/premium/pdfhub/smartdata'),
    },
    {
      title: 'PDF Converter Pro',
      description: 'Convert PDFs to Word, Excel, text, and formatted document files.',
      icon: FileDown,
      gradient: 'from-orange-500 to-red-500',
      onClick: () => navigate('/premium/pdfhub/converterpro'),
    },
    {
      title: 'Bulk PDF Toolkit',
      description: 'Process multiple PDF files simultaneously – merge, split, and compress.',
      icon: Package,
      gradient: 'from-pink-500 to-rose-500',
      onClick: () => navigate('/premium/pdfhub/bulk-toolkit'),
    },
  ];

  return (
    <div className="space-y-8 w-full pt-2 pb-12">
      <SEO 
        title="PDF Document Intelligence Hub & RAG Vector Search"
        description="Interact with PDFs using vector search RAG, AI PDF Brain summarization, smart table extraction, and PDF batch processing."
        canonical="/premium/pdfhub"
      />
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-[#2640D9]/20 bg-[#0b0b0f] shadow-xl shadow-black/40">
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl font-light tracking-tight text-white font-['Inter']">
            PDF Intelligence Hub
          </h1>
          <p className="text-xs max-w-2xl leading-relaxed text-[#737373] font-normal">
            Upload PDF assets to run queries, summarize pages, and extract data tables.
          </p>
        </div>
      </div>

      {/* Grid of Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            gradient={tool.gradient}
            isDarkMode={isDarkMode}
            onClick={tool.onClick}
            icon={tool.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default PDFHub;