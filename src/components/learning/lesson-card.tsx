import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, CheckCircle, Lock, Play, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number; // 0-100
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  xpReward: number;
  stars?: number; // 0-3 stars earned
  category: string;
  className?: string;
  onClick?: () => void;
}

const LessonCard = ({ 
  id, 
  title, 
  description, 
  duration, 
  difficulty, 
  progress, 
  status, 
  xpReward, 
  stars = 0, 
  category,
  className,
  onClick 
}: LessonCardProps) => {
  const { toast } = useToast();
  const difficultyColors = {
    beginner: 'bg-success-light text-success border-success/20',
    intermediate: 'bg-warning-light text-warning border-warning/20',
    advanced: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const statusConfig = {
    locked: {
      icon: Lock,
      buttonText: 'Locked',
      buttonVariant: 'secondary' as const,
      disabled: true,
      cardOpacity: 'opacity-60'
    },
    available: {
      icon: Play,
      buttonText: 'Start Lesson',
      buttonVariant: 'default' as const,
      disabled: false,
      cardOpacity: ''
    },
    'in-progress': {
      icon: Play,
      buttonText: 'Continue',
      buttonVariant: 'default' as const,
      disabled: false,
      cardOpacity: ''
    },
    completed: {
      icon: CheckCircle,
      buttonText: 'Review',
      buttonVariant: 'secondary' as const,
      disabled: false,
      cardOpacity: ''
    }
  };

  const config = statusConfig[status];
  const handleCardClick = () => {
    if (config.disabled) return;
    
    // Show appropriate toast based on lesson status
    if (status === 'available') {
      toast({
        title: "🚀 Lesson Started!",
        description: `Starting "${title}" - Good luck on your learning journey!`,
        duration: 3000,
      });
    } else if (status === 'in-progress') {
      toast({
        title: "📚 Continuing Lesson",
        description: `Resuming "${title}" - You're ${Math.round(progress)}% complete!`,
        duration: 3000,
      });
    } else if (status === 'completed') {
      toast({
        title: "📖 Reviewing Lesson",
        description: `Opening "${title}" for review - You earned ${stars} stars!`,
        duration: 3000,
      });
    }
    
    onClick?.();
  };

  const Icon = config.icon;

  return (
    <Card 
      className={cn(
        'group hover:shadow-medium transition-all duration-300 cursor-pointer',
        config.cardOpacity,
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
              <Badge 
                className={cn('text-xs', difficultyColors[difficulty])}
              >
                {difficulty}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          {status === 'completed' && stars > 0 && (
            <div className="flex items-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <Star 
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < stars ? 'text-accent fill-accent' : 'text-muted'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>

        {/* Progress (for in-progress lessons) */}
        {status === 'in-progress' && progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{duration}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{xpReward} XP</span>
            </div>
          </div>
          
          <Button 
            size="sm"
            variant={config.buttonVariant}
            disabled={config.disabled}
            className="min-w-[100px]"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <Icon className="w-4 h-4 mr-2" />
            {config.buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonCard;