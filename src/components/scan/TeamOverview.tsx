
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/types/types';

interface TeamOverviewProps {
  users: Partial<User>[];
}

const TeamOverview: React.FC<TeamOverviewProps> = ({ users }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const getEmotionalLevelText = (score?: number) => {
    if (!score) return 'Non évalué';
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Bon';
    if (score >= 50) return 'Moyen';
    if (score >= 30) return 'Préoccupé';
    return 'Critique';
  };
  
  const getEmotionalLevelColor = (score?: number) => {
    if (!score) return 'bg-gray-200';
    if (score >= 80) return 'bg-green-500';
    if (score >= 65) return 'bg-emerald-400';
    if (score >= 50) return 'bg-yellow-400';
    if (score >= 30) return 'bg-orange-400';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aperçu de l'équipe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {users.map(user => (
          <div key={user.id} className="space-y-2">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={user.avatar_url || ''} alt={user.name || 'Avatar'} />
                <AvatarFallback>{user.name ? getInitials(user.name) : 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.anonymity_code || user.name}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {getEmotionalLevelText(user.emotional_score)}
                  </p>
                  <p className="text-xs font-medium">
                    {user.emotional_score || 0}%
                  </p>
                </div>
                <Progress 
                  value={user.emotional_score || 0} 
                  className="h-1.5 mt-1" 
                />
              </div>
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            Aucun membre dans l'équipe pour le moment
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamOverview;
