import React from 'react';
import ToolCard from './ToolCard';
import { BarChart3, Brain, FileDown, Calculator, AlertTriangle } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import SEO from '../../common/SEO';
import { WorkspaceToolLoader } from '../../common/PageLoader';

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
    return <WorkspaceToolLoader title="Loading Excel Analytics Suite..." />;
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
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-[#2640D9]/20 bg-[#0b0b0f] shadow-xl shadow-black/40">
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl font-light tracking-tight text-white font-['Inter']">
            Excel Genius Suite
          </h1>
          <p className="text-xs max-w-2xl leading-relaxed text-[#737373] font-normal">
            Analyze spreadsheet records, generate custom formulas, and detect anomalies.
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