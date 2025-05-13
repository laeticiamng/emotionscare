
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge, Challenge } from '@/types/gamification';
import { getBadgesForUser, getChallengesForUser } from '@/lib/gamificationService';
import { useAuth } from '@/contexts/AuthContext';

const GamificationPage = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        if (user?.id) {
          const badgesData = await getBadgesForUser(user.id);
          const challengesData = await getChallengesForUser(user.id);
          
          setBadges(badgesData);
          setChallenges(challengesData);
        }
      } catch (error) {
        console.error('Error loading gamification data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">Gamification</h1>
      
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="badges" className="space-y-4">
          <TabsList>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="badges">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className="bg-card rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="challenges">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-card rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold">{challenge.title || challenge.name}</h3>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Accepter le défi
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default GamificationPage;
