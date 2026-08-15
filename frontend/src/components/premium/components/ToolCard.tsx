import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  gradient?: string;
  isDarkMode?: boolean;
  onClick: () => void;
  className?: string;
  icon: React.ElementType;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  isDarkMode = true, 
  onClick, 
  className 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl p-6 border transition-all duration-300 cursor-pointer group flex flex-col justify-between transform hover:-translate-y-1 ${
        isDarkMode 
          ? 'bg-[#0b0b0f] border-[#262626] hover:border-[#2640D9]/40 hover:shadow-2xl hover:shadow-[#2640D9]/5 text-white' 
          : 'bg-white border-gray-200 hover:border-[#2640D9]/30 hover:shadow-xl text-gray-900'
      } min-h-[12rem] ${className || ''}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${
            isDarkMode 
              ? 'bg-[#2640D9]/5 text-[#8A66E6] border-[#2640D9]/20 group-hover:border-[#2640D9]/40 group-hover:bg-[#2640D9]/10' 
              : 'bg-[#2640D9]/5 text-[#2640D9] border-[#2640D9]/10 group-hover:bg-[#2640D9]/10'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={`p-1.5 rounded-full transition-all duration-200 ${
            isDarkMode ? 'text-gray-500 group-hover:text-[#8A66E6] group-hover:bg-[#2640D9]/10' : 'text-gray-400 group-hover:text-[#2640D9] group-hover:bg-[#2640D9]/5'
          }`}>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        <h3 className={`font-bold text-lg mb-2 group-hover:text-[#8A66E6] transition-colors ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h3>

        <p className={`text-xs sm:text-sm leading-relaxed ${
          isDarkMode ? 'text-[#737373]' : 'text-gray-600'
        }`}>
          {description}
        </p>
      </div>

      <div className={`pt-4 mt-4 border-t flex items-center justify-between text-xs font-semibold ${
        isDarkMode ? 'border-[#262626] text-[#8A66E6]' : 'border-gray-100 text-[#2640D9]'
      }`}>
        <span>Open Application</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">➔</span>
      </div>
    </div>
  );
};

export default ToolCard;