
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  anonymity_code: string;
  joined_at?: string;
  last_active?: string;
  emotional_score?: number;
  avatar?: string;
}

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Determine emotional score color
  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-300';
    
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Profil utilisateur</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
        
        <Badge className="mb-6">{user.role}</Badge>
        
        {user.emotional_score !== undefined && (
          <div className="mb-6 flex flex-col items-center">
            <div className="text-sm text-muted-foreground mb-2">Score émotionnel</div>
            <div className="relative h-24 w-24 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full ${getScoreColor(user.emotional_score)} opacity-20`}></div>
              <div className="text-4xl font-bold">{user.emotional_score}</div>
            </div>
          </div>
        )}
        
        <div className="w-full pt-4 border-t space-y-3">
          <div className="flex justify-between text-sm">
            <div className="text-muted-foreground">Code anonyme:</div>
            <div className="font-medium">{user.anonymity_code}</div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>Date d'inscription:</span>
            </div>
            <div className="font-medium">{formatDate(user.joined_at)}</div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="text-muted-foreground">Dernière activité:</div>
            <div className="font-medium">{formatDate(user.last_active)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
