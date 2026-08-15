import React from 'react';
import { useNavigate } from 'react-router-dom';
import ToolCard from './ToolCard';
import { MessageSquare, Mail, FileText, ShoppingBag, Megaphone } from 'lucide-react';

interface AIWorkmateProps {
  isDarkMode?: boolean;
}

const AIWorkmate: React.FC<AIWorkmateProps> = ({ isDarkMode = false }) => {
  const navigate = useNavigate();

  const handleToolClick = (toolTitle: string) => {
    if (toolTitle === 'AI Agent') {
      navigate('/premium/aiworkmate/aiagent');
    } else {
      console.log(`Opening ${toolTitle}`);
    }
  };
  const tools = [
    {
      title: 'AI Agent',
      description: 'ChatGPT-4 level AI assistant for all tasks',
      icon: MessageSquare,
      gradient: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
    {
      title: 'Smart Email Drafter',
      description: 'Create professional emails instantly',
      icon: Mail,
      gradient: 'bg-gradient-to-r from-blue-500 to-purple-500',
    },
    {
      title: 'Resume Evaluator',
      description: 'Enhance and evaluate your resume',
      icon: FileText,
      gradient: 'bg-gradient-to-r from-green-500 to-teal-500',
    },
    {
      title: 'Product Description Pro',
      description: 'Create compelling product descriptions',
      icon: ShoppingBag,
      gradient: 'bg-gradient-to-r from-pink-500 to-rose-500',
    },
    {
      title: 'Marketing Copy Generator',
      description: 'Generate marketing content and copy',
      icon: Megaphone,
      gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-start py-6 space-y-8" style={{ minHeight: '60vh' }}>
      {/* Header Section */}
      <div className="w-full relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-[#2640D9]/20 bg-[#0b0b0f] shadow-xl shadow-black/40">
        <div className="relative z-10 space-y-1 text-left">
          <h1 className="text-2xl font-light tracking-tight text-white font-['Inter']">
            AI Workmate
          </h1>
          <p className="text-xs max-w-2xl leading-relaxed text-[#737373] font-normal">
            Execute writing assistant pipelines, analyze resumes, and generate copy drafts.
          </p>
        </div>
      </div>
      {/* Message Input Box - Placed Above */}
      <div className="w-full flex justify-center mb-6">
        {/* Replace with actual chat input component if needed */}
        <div className="w-full max-w-2xl">
          {/* Placeholder for message input box, replace with actual input if needed */}
          <input type="text" placeholder="Message AI Assistant..." className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>
      {/* Dashboard Tools - Reduced Vertical Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full items-start justify-start">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            gradient={tool.gradient}
            isDarkMode={isDarkMode}
            onClick={() => handleToolClick(tool.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default AIWorkmate;