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
          ? 'bg-gray-900/80 backdrop-blur-xl border-gray-800 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/15 text-white' 
          : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-xl text-gray-900'
      } min-h-[12rem] ${className || ''}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${
            isDarkMode 
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:border-purple-500/40 group-hover:bg-purple-500/20' 
              : 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-100'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={`p-1.5 rounded-full transition-all duration-200 ${
            isDarkMode ? 'text-gray-500 group-hover:text-purple-400 group-hover:bg-purple-500/10' : 'text-gray-400 group-hover:text-purple-600 group-hover:bg-purple-50'
          }`}>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        <h3 className={`font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h3>

        <p className={`text-xs sm:text-sm leading-relaxed ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {description}
        </p>
      </div>

      <div className={`pt-4 mt-4 border-t flex items-center justify-between text-xs font-semibold ${
        isDarkMode ? 'border-gray-800/80 text-purple-400' : 'border-gray-100 text-purple-600'
      }`}>
        <span>Open Application</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">➔</span>
      </div>
    </div>
  );
};

export default ToolCard;