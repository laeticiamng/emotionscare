import React, { useState } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFollow } from '@/hooks/community';

interface FollowButtonProps {
  userId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showStats?: boolean;
}

export function FollowButton({ 
  userId, 
  variant = 'outline',
  size = 'sm',
  showStats = false 
}: FollowButtonProps) {
  const { isFollowing, loading, stats, toggleFollow } = useFollow(userId);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isFollowing ? 'secondary' : variant}
        size={size}
        onClick={toggleFollow}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isFollowing ? (
          <>
            <UserMinus className="h-4 w-4 mr-1" />
            Suivi
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-1" />
            Suivre
          </>
        )}
      </Button>
      
      {showStats && (
        <span className="text-xs text-muted-foreground">
          {stats.followersCount} abonné{stats.followersCount > 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}

export default FollowButton;
