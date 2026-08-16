import React from 'react';
import NexaFlowLogo from './NexaFlowLogo';

interface PageLoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  label = 'Initializing AI Workspace...', 
  fullScreen = true 
}) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030305] text-white overflow-hidden"
    : "w-full min-h-[60vh] flex flex-col items-center justify-center bg-[#050505] text-white p-8 rounded-3xl";

  return (
    <div className={containerClasses}>
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2640D9]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8A66E6]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Central Animated Vector Core Ring */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer Ring */}
        <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-[#2640D9] border-r-[#2640D9]/50 animate-spin" style={{ animationDuration: '1s' }} />
        
        {/* Inner Counter-Spinning Ring */}
        <div className="absolute w-11 h-11 rounded-full border-2 border-transparent border-b-[#8A66E6] border-l-[#8A66E6]/50 animate-spin" style={{ animationDuration: '1.4s', animationDirection: 'reverse' }} />

        {/* Center Glowing Logo Core */}
        <div className="absolute w-8 h-8 flex items-center justify-center">
          <NexaFlowLogo className="w-full h-full" />
        </div>
      </div>

      {/* Brand Title & Status Line */}
      <div className="space-y-2 text-center relative z-10">
        <div className="text-xl font-light tracking-tight font-['Inter']">
          NexaFlow <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#2640D9] to-[#8A66E6]">AI</span>
        </div>
        <p className="text-xs text-[#737373] tracking-wider uppercase font-medium animate-pulse">
          {label}
        </p>
      </div>

      {/* Bottom Shimmer Progress Bar */}
      <div className="w-36 h-1 bg-[#1a1a24] rounded-full overflow-hidden mt-6 relative z-10">
        <div className="h-full bg-gradient-to-r from-[#2640D9] via-[#8A66E6] to-[#2640D9] rounded-full w-full animate-pulse" />
      </div>
    </div>
  );
};

export const WorkspaceToolLoader: React.FC<{ title?: string }> = ({ title = 'Loading Tool Suite...' }) => {
  return (
    <div className="w-full min-h-[65vh] flex flex-col justify-center items-center py-12 px-4 animate-fade-in">
      <div className="w-full max-w-4xl space-y-6">
        {/* Skeleton Banner Header */}
        <div className="w-full h-32 rounded-3xl bg-[#0b0b0f] border border-[#262626] p-6 flex flex-col justify-center space-y-3 relative overflow-hidden">
          <div className="w-48 h-5 rounded-md bg-[#1a1a24] animate-pulse" />
          <div className="w-80 h-3 rounded-md bg-[#16161e] animate-pulse" />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-t-[#2640D9] border-r-transparent animate-spin" />
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 rounded-2xl bg-[#0b0b0f] border border-[#262626] p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a1a24] animate-pulse" />
                <div className="w-36 h-4 rounded bg-[#16161e] animate-pulse" />
                <div className="w-full h-3 rounded bg-[#121218] animate-pulse" />
              </div>
              <div className="w-20 h-3 rounded bg-[#1a1a24] animate-pulse" />
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <p className="text-xs text-[#737373] tracking-widest uppercase font-medium animate-pulse flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2640D9] animate-ping" />
            <span>{title}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
