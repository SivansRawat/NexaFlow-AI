// frontend/src/components/ui/SkeletonLoader.tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
  variant?: 'text' | 'circle' | 'rect';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  count = 1,
  height = '20px',
  width = '100%',
  variant = 'text'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full aspect-square';
      case 'rect':
        return 'rounded-lg';
      default:
        return 'rounded';
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-gray-700/50',
            getVariantClasses(),
            className
          )}
          style={{
            height: variant === 'text' ? height : height,
            width: variant === 'text' ? width : width,
          }}
        />
      ))}
    </>
  );
};