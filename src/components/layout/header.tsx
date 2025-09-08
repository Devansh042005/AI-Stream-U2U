import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProgressRing from '@/components/ui/progress-ring';
import { Flame, Coins, Menu, Bell, User, LogOut, Wallet, Crown, Settings } from 'lucide-react';
import { NotificationCenter } from '../notifications/notification-center';
import { cn } from '@/lib/utils';

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
    level: number;
    xp: number;
    maxXp: number;
    streak: number;
    tokens: number;
  };
}

const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();
  const { user: authUser, signOut, userRole } = useAuth();
  const { account, disconnectWallet } = useWallet();
  
  const defaultUser = {
    name: authUser?.email?.split('@')[0] || "User",
    avatar: undefined,
    level: 12,
    xp: 2840,
    maxXp: 3000,
    streak: 7,
    tokens: 1250
  };

  const currentUser = user || defaultUser;
  const xpProgress = (currentUser.xp / currentUser.maxXp) * 100;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Brand */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">LearnQuest</span>
          </div>
        </div>

        {/* Right side - User info */}
        <div className="flex items-center space-x-4">
          {/* Role Badge */}
          {userRole && (
            <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="hidden sm:flex">
              {userRole === 'admin' ? <Crown className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
              {userRole.toUpperCase()}
            </Badge>
          )}

          {/* Wallet Status */}
          {account && (
            <div className="hidden sm:flex items-center space-x-2 bg-gradient-card rounded-lg px-3 py-2">
              <Wallet className="w-4 h-4 text-green-500" />
              <span className="text-xs font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
            </div>
          )}

          {/* Streak */}
          <div className="hidden sm:flex items-center space-x-2 bg-gradient-card rounded-lg px-3 py-2">
            <Flame className="w-5 h-5 text-streak" />
            <span className="font-semibold text-sm">{currentUser.streak}</span>
          </div>

          {/* Tokens */}
          <div className="hidden md:flex items-center space-x-2 bg-gradient-card rounded-lg px-3 py-2">
            <Coins className="w-5 h-5 text-accent" />
            <span className="font-semibold text-sm">{currentUser.tokens.toLocaleString()}</span>
          </div>

          {/* Level & XP */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold">Level {currentUser.level}</div>
              <div className="text-xs text-muted-foreground">
                {currentUser.xp}/{currentUser.maxXp} XP
              </div>
            </div>
            <ProgressRing progress={xpProgress} size="sm">
              <span className="text-xs font-bold text-primary">{currentUser.level}</span>
            </ProgressRing>
          </div>

          {/* Notifications */}
          <NotificationCenter />

          {/* User Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background border shadow-lg" align="end" forceMount>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              {userRole === 'admin' && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </DropdownMenuItem>
              )}
              {account && (
                <DropdownMenuItem onClick={disconnectWallet}>
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Disconnect Wallet</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;