import React from 'react';

interface NexaFlowLogoProps {
  className?: string;
  size?: number | string;
}

export const NexaFlowLogo: React.FC<NexaFlowLogoProps> = ({
  className = "w-9 h-9",
  size,
}) => {
  const style = size ? { width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size } : undefined;

  return (
    <img
      src="/nexaflow-app-logo.png"
      alt="NexaFlow AI Logo"
      className={`object-contain flex-shrink-0 ${className}`}
      style={style}
    />
  );
};

export default NexaFlowLogo;
