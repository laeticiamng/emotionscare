// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, CheckCircle, Star } from 'lucide-react';
import { GamificationStats } from '@/types/gamification';

interface UserSidePanelProps {
  userName?: string;
  userAvatar?: string;
  stats?: GamificationStats;
  emotionalAssessment?: {
    currentMood: string;
    moodIntensity: number;
    lastUpdated: string;
    suggestions: string[];
  };
}

const UserSidePanel: React.FC<UserSidePanelProps> = ({
  userName = 'User',
  userAvatar = '/avatars/default.png',
  stats,
  emotionalAssessment
}) => {
  
  return (
    <div className="space-y-6">
      {/* User profile card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold">{userName}</h3>
            
            <div className="flex mt-2 gap-2">
              <Badge variant="outline" className="bg-primary/10">
                Level {stats?.level || 1}
              </Badge>
              <Badge variant="outline" className="bg-primary/10">
                <Star className="h-3 w-3 mr-1" /> {stats?.points || 0} points
              </Badge>
            </div>
            
            <div className="w-full mt-4">
              <Button variant="outline" className="w-full">
                Voir mon profil complet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Emotional assessment card */}
      {emotionalAssessment && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">État émotionnel actuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium capitalize">
                    {emotionalAssessment.currentMood}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(emotionalAssessment.lastUpdated).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${emotionalAssessment.moodIntensity}%` }}
                  ></div>
                </div>
              </div>
              
              {emotionalAssessment.suggestions && (
                <div>
                  <h4 className="text-xs font-medium mb-2">Suggestions:</h4>
                  <ul className="text-xs space-y-1">
                    {emotionalAssessment.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-primary mr-1 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button size="sm" className="w-full">
                Nouvel enregistrement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Stats card */}
      {stats && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Mes statistiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Série actuelle</span>
                <span className="font-bold text-xl">{stats.streakDays} jours</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Meilleure série</span>
                <span className="font-bold text-xl">{stats.longestStreak} jours</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Défis complétés</span>
                <span className="text-sm text-muted-foreground">
                  {stats.completedChallenges}/{stats.totalChallenges}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(stats.completedChallenges / stats.totalChallenges) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Badges débloqués</span>
                <span className="text-sm text-muted-foreground">
                  {stats.unlockedBadges}/{stats.totalBadges}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(stats.unlockedBadges / stats.totalBadges) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" />
              Voir mes progrès
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserSidePanel;
