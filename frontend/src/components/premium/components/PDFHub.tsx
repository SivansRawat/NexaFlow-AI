import React from 'react';
import ToolCard from './ToolCard';
import { FileText, MessageSquare, FileDown, Package, Database, Sparkles } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

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
      {/* Header Section */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-gray-900 border-purple-500/30 shadow-xl shadow-purple-900/10' 
          : 'bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-purple-200 shadow-lg'
      }`}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Document AI Suite</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            PDF Intelligence Hub
          </h1>
          <p className={`text-sm max-w-2xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Automate document workflows, chat with long PDF files using RAG embeddings, extract data tables, and batch process documents.
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