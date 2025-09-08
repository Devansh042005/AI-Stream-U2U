import React from 'react';
import { cn } from '@/lib/utils';
import { Award, Star, Target, Trophy } from 'lucide-react';

interface AchievementBadgeProps {
  type: 'gold' | 'silver' | 'bronze';
  icon?: 'award' | 'star' | 'target' | 'trophy';
  title: string;
  description?: string;
  unlocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AchievementBadge = ({ 
  type, 
  icon = 'award', 
  title, 
  description, 
  unlocked = true, 
  size = 'md',
  className 
}: AchievementBadgeProps) => {
  const icons = {
    award: Award,
    star: Star,
    target: Target,
    trophy: Trophy
  };

  const Icon = icons[icon];

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const badgeColors = {
    gold: unlocked ? 'bg-badge-gold text-white shadow-glow' : 'bg-muted text-muted-foreground',
    silver: unlocked ? 'bg-badge-silver text-foreground shadow-medium' : 'bg-muted text-muted-foreground',
    bronze: unlocked ? 'bg-badge-bronze text-white shadow-medium' : 'bg-muted text-muted-foreground'
  };

  return (
    <div className={cn('text-center space-y-2', className)}>
      <div 
        className={cn(
          'rounded-full flex items-center justify-center transition-all duration-300',
          sizes[size],
          badgeColors[type],
          unlocked ? 'hover:scale-110' : 'opacity-50'
        )}
      >
        <Icon className={cn(iconSizes[size], unlocked ? '' : 'opacity-50')} />
      </div>
      <div className="space-y-1">
        <h4 className={cn(
          'font-semibold leading-none',
          unlocked ? 'text-foreground' : 'text-muted-foreground',
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        )}>
          {title}
        </h4>
        {description && (
          <p className={cn(
            'text-muted-foreground leading-tight',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default AchievementBadge;