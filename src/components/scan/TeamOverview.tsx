
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types';

interface TeamOverviewProps {
  users: User[];
}

const TeamOverview = ({ users }: TeamOverviewProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-200';
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const handleUserClick = (userId: string) => {
    navigate(`/scan/${userId}`);
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Équipe médicale</h2>
        <p className="text-gray-600 mb-4">Consultez l'état émotionnel de votre équipe</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((userData) => (
          <Card 
            key={userData.id}
            className="cursor-pointer transition-all hover:shadow-md hover:bg-accent"
            onClick={() => handleUserClick(userData.id)}
          >
            <CardContent className="flex items-center p-4">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback>{(userData.name?.substring(0, 2) || 'UN').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">
                  {user?.id === userData.id ? 
                    userData.name : 
                    userData.anonymity_code || `Anonyme ${userData.id.substring(0, 4)}`
                  }
                </div>
                <div className="text-sm text-muted-foreground">{userData.role || 'Pas de rôle'}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={userData.emotional_score ? "default" : "outline"}>
                  Score: {userData.emotional_score || 'N/A'}
                </Badge>
                <div className={`w-3 h-3 rounded-full ${getScoreColor(userData.emotional_score)}`}></div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {users.length === 0 && (
          <div className="col-span-2 text-center p-8 text-muted-foreground">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>
    </>
  );
};

export default TeamOverview;
