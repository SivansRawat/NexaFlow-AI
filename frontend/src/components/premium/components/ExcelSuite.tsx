import React from 'react';
import ToolCard from './ToolCard';
import { BarChart3, Brain, FileDown, Calculator, AlertTriangle, Sparkles } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import SEO from '../../common/SEO';

interface ExcelSuiteProps {
  isDarkMode?: boolean;
}

const ExcelSuite: React.FC<ExcelSuiteProps> = () => {
  const outletContext = useOutletContext<{ isDarkMode?: boolean }>() || {};
  const isDarkMode = outletContext.isDarkMode ?? true;
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start justify-start animate-pulse pt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`rounded-2xl p-6 border ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-gray-200/60 border-gray-200'} h-52`}></div>
        ))}
      </div>
    );
  }

  const tools = [
    {
      title: 'Chart Builder',
      description: 'Create stunning, publication-quality charts and visual analytics directly from your data.',
      icon: BarChart3,
      path: 'chartbuilder',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'AI Sheet Summarizer',
      description: 'Get instant key insights, statistical summaries, and executive reports from your spreadsheets.',
      icon: Brain,
      path: 'aisheet',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Formula Master',
      description: 'Write, debug, and explain complex Excel formulas instantly using AI.',
      icon: Calculator,
      path: 'formulamaster',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Error & Trend Detector',
      description: 'Identify data anomalies, broken formulas, missing values, and hidden trend patterns automatically.',
      icon: AlertTriangle,
      path: 'detect',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Export Wizard',
      description: 'Export and transform your dataset into various formats including Excel, CSV, and formatted JSON.',
      icon: FileDown,
      path: 'exportwizard',
      gradient: 'from-blue-500 to-indigo-500'
    }
  ];

  const handleToolClick = (route: string) => {
    if (route) {
      navigate(`/premium/excel/${route}`);
    }
  };

  return (
    <div className="space-y-8 w-full pt-2 pb-12">
      <SEO 
        title="AI Excel Analytics & Formula Master"
        description="Supercharge spreadsheets with AI Chart Builder, Excel Formula Master, Error & Trend Detector, and AI Sheet Summarizer."
        canonical="/premium/excel"
      />
      {/* Header Section */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-gray-900 border-emerald-500/30 shadow-xl shadow-emerald-900/10' 
          : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-emerald-200 shadow-lg'
      }`}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Excel Automation Suite</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Excel Genius Suite
          </h1>
          <p className={`text-sm max-w-2xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Smart automated tools for spreadsheet analysis, chart building, formula explanation, error detection, and multi-format data export.
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
            onClick={() => handleToolClick(tool.path)}
            icon={tool.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default ExcelSuite;