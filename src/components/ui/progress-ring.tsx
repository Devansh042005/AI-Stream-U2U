import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}

const ProgressRing = ({ progress, size = 'md', children, className }: ProgressRingProps) => {
  const sizes = {
    sm: { container: 'w-12 h-12', stroke: 3, radius: 18 },
    md: { container: 'w-16 h-16', stroke: 4, radius: 24 },
    lg: { container: 'w-24 h-24', stroke: 6, radius: 36 }
  };
  
  const config = sizes[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  return (
    <div className={cn('relative flex items-center justify-center', config.container, className)}>
      <svg
        className="transform -rotate-90 w-full h-full"
        width={config.radius * 2 + config.stroke * 2}
        height={config.radius * 2 + config.stroke * 2}
      >
        {/* Background circle */}
        <circle
          cx={config.radius + config.stroke}
          cy={config.radius + config.stroke}
          r={config.radius}
          stroke="currentColor"
          strokeWidth={config.stroke}
          fill="transparent"
          className="text-muted opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx={config.radius + config.stroke}
          cy={config.radius + config.stroke}
          r={config.radius}
          stroke="url(#progress-gradient)"
          strokeWidth={config.stroke}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--xp-purple))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ProgressRing;