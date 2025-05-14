
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User } from '@/types';

interface TeamOverviewProps {
  users: Partial<User>[];
  onUserClick?: (userId: string) => void;
}

const TeamOverview: React.FC<TeamOverviewProps> = ({ users, onUserClick }) => {
  const getEmotionalScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-300';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map((user) => (
        <Card 
          key={user.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => user.id && onUserClick?.(user.id)}
        >
          <CardContent className="p-4 flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar || user.avatar_url} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{user.anonymity_code || user.name}</div>
              <div className="text-sm text-muted-foreground">{user.position || user.department || 'Team Member'}</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getEmotionalScoreColor(user.emotional_score)}`} />
              <span className="text-sm font-medium">{user.emotional_score || '?'}</span>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {users.length === 0 && (
        <p className="col-span-2 text-center py-4 text-muted-foreground">
          No team members available
        </p>
      )}
    </div>
  );
};

export default TeamOverview;
