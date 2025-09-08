import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Crown, Medal, Award, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  rank: number;
  streak: number;
  weeklyXp: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  timeframe: 'weekly' | 'monthly' | 'all-time';
  className?: string;
}

const Leaderboard = ({ entries, timeframe, className }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-badge-gold" />;
      case 2:
        return <Medal className="w-5 h-5 text-badge-silver" />;
      case 3:
        return <Award className="w-5 h-5 text-badge-bronze" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-badge-gold text-white';
      case 2:
        return 'bg-badge-silver text-foreground';
      case 3:
        return 'bg-badge-bronze text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const timeframeLabels = {
    weekly: 'This Week',
    monthly: 'This Month',
    'all-time': 'All Time'
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Leaderboard</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {timeframeLabels[timeframe]}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg transition-all duration-200',
              entry.isCurrentUser 
                ? 'bg-primary/10 border border-primary/20 shadow-glow' 
                : 'bg-gradient-card hover:shadow-soft',
              'group cursor-pointer'
            )}
          >
            {/* Rank */}
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              getRankBadgeColor(entry.rank)
            )}>
              {entry.rank <= 3 ? (
                getRankIcon(entry.rank)
              ) : (
                <span className="text-sm font-bold">#{entry.rank}</span>
              )}
            </div>

            {/* Avatar */}
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={entry.avatar} alt={entry.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {entry.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className={cn(
                  'font-semibold truncate',
                  entry.isCurrentUser ? 'text-primary' : 'text-foreground'
                )}>
                  {entry.name}
                  {entry.isCurrentUser && (
                    <span className="text-xs text-primary ml-1">(You)</span>
                  )}
                </h4>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <span>Level {entry.level}</span>
                <span>•</span>
                <span>{entry.streak} day streak</span>
              </div>
            </div>

            {/* XP */}
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-sm">
                {timeframe === 'weekly' ? entry.weeklyXp : entry.xp} XP
              </div>
              <div className="text-xs text-muted-foreground">
                {timeframe === 'weekly' ? 'this week' : 'total'}
              </div>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No data available for this timeframe</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;