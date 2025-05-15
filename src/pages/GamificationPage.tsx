import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from '@/contexts/AuthContext';
import { fetchGamificationStats, fetchChallenges, fetchUserBadges } from '@/lib/gamificationService';

const GamificationPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [gamificationStats, setGamificationStats] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGamificationData = async () => {
      setIsLoading(true);
      try {
        // Use the correct function name
        const stats = await fetchGamificationStats(userId);
        setGamificationStats(stats);
        
        // Load other data
        const challenges = await fetchChallenges(userId);
        setChallenges(challenges);
        
        const badges = await fetchUserBadges(userId);
        setBadges(badges);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading gamification data:", error);
        setIsLoading(false);
      }
    };
    
    loadGamificationData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Chargement des données...</h1>
        <Skeleton className="w-[300px] h-[40px] mb-2" />
        <Skeleton className="w-[200px] h-[30px] mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton className="w-[100px] h-[20px] mb-2" />
                <Skeleton className="w-[150px] h-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vos progrès</h1>

      {gamificationStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{gamificationStats.points}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Niveau</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{gamificationStats.level}</div>
              {gamificationStats.nextLevel && (
                <div className="text-sm text-muted-foreground">
                  {gamificationStats.pointsToNextLevel} points pour le prochain niveau
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Série</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{gamificationStats.streakDays} jours</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Défis en cours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardHeader>
                <CardTitle>{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
                <Progress value={challenge.progress} max={challenge.goal} className="mt-2" />
                <div className="text-sm text-muted-foreground">
                  {challenge.progress} / {challenge.goal}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Badges</h2>
        <ScrollArea className="h-[300px] w-full">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {badges.map((badge) => (
              <Card key={badge.id}>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={badge.image_url} alt={badge.name} />
                    <AvatarFallback>{badge.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium mt-2">{badge.name}</div>
                  <div className="text-xs text-muted-foreground">{badge.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default GamificationPage;
