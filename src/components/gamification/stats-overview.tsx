import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressRing from '@/components/ui/progress-ring';
import AchievementBadge from '@/components/ui/achievement-badge';
import { Flame, Target, Trophy, TrendingUp, Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsOverviewProps {
  stats: {
    level: number;
    xp: number;
    maxXp: number;
    streak: number;
    totalLessons: number;
    completedLessons: number;
    weeklyGoal: number;
    weeklyProgress: number;
    studyTime: number; // in minutes
  };
  recentAchievements: Array<{
    id: string;
    type: 'gold' | 'silver' | 'bronze';
    icon: 'award' | 'star' | 'target' | 'trophy';
    title: string;
  }>;
  className?: string;
}

const StatsOverview = ({ stats, recentAchievements, className }: StatsOverviewProps) => {
  const levelProgress = (stats.xp / stats.maxXp) * 100;
  const lessonProgress = (stats.completedLessons / stats.totalLessons) * 100;
  const weeklyProgress = (stats.weeklyProgress / stats.weeklyGoal) * 100;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Level & XP Overview */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Level Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-primary">Level {stats.level}</h3>
              <p className="text-muted-foreground">
                {stats.xp.toLocaleString()} / {stats.maxXp.toLocaleString()} XP
              </p>
            </div>
            <ProgressRing progress={levelProgress} size="lg">
              <span className="text-sm font-bold">{Math.round(levelProgress)}%</span>
            </ProgressRing>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <Card className="text-center">
          <CardContent className="p-4 space-y-2">
            <div className="w-12 h-12 bg-gradient-achievement rounded-full flex items-center justify-center mx-auto">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-streak">{stats.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Goal */}
        <Card className="text-center">
          <CardContent className="p-4 space-y-2">
            <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-success">{stats.weeklyProgress}</div>
              <div className="text-xs text-muted-foreground">of {stats.weeklyGoal} lessons</div>
            </div>
          </CardContent>
        </Card>

        {/* Study Time */}
        <Card className="text-center">
          <CardContent className="p-4 space-y-2">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">{formatTime(stats.studyTime)}</div>
              <div className="text-xs text-muted-foreground">This week</div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="text-center">
          <CardContent className="p-4 space-y-2">
            <div className="w-12 h-12 bg-gradient-level rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">{Math.round(lessonProgress)}%</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-accent" />
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex-shrink-0">
                  <AchievementBadge
                    type={achievement.type}
                    icon={achievement.icon}
                    title={achievement.title}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsOverview;