
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { toast } from "@/components/ui/sonner";
import {
  fetchChallenges,
  fetchUserChallenges,
  completeChallenge,
  fetchBadges,
  awardBadge
} from '@/lib/gamificationService';
import type { Challenge, UserChallenge, Badge, UserBadge } from '@/types/gamification';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Award, Check } from "lucide-react";
import confetti from 'canvas-confetti';

const GamificationPage: React.FC = () => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [showNewBadge, setShowNewBadge] = useState<Badge | null>(null);

  // Load data on mount
  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const [allChallenges, userProgress, badgeData] = await Promise.all([
          fetchChallenges(),
          fetchUserChallenges(user.id),
          fetchBadges(user.id)
        ]);
        
        setChallenges(allChallenges);
        setUserChallenges(userProgress);
        setBadges(badgeData.all);
        setEarnedBadges(badgeData.earned);
      } catch (error: any) {
        uiToast({
          title: "Erreur",
          description: `Impossible de charger les données: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, uiToast]);

  // Calculate total points earned today
  const todayPoints = userChallenges
    .filter(uc => uc.completed)
    .reduce((sum, uc) => {
      const c = challenges.find(ch => ch.id === uc.challenge_id);
      return sum + (c?.points || 0);
    }, 0);

  // Check and award badges if threshold reached
  useEffect(() => {
    const checkForNewBadges = async () => {
      if (!user || !badges.length || !todayPoints) return;
      
      for (const badge of badges) {
        if (todayPoints >= badge.threshold && 
            !earnedBadges.some(eb => eb.badge_id === badge.id)) {
          try {
            const newBadge = await awardBadge({
              user_id: user.id,
              badge_id: badge.id,
              awarded_on: new Date().toISOString()
            });
            
            setEarnedBadges(prev => [...prev, newBadge]);
            setShowNewBadge(badge);
            
            // Trigger confetti
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            
            // Utiliser Sonner toast pour les notifications visibles
            toast.success(
              `Félicitations ! Vous avez obtenu le badge "${badge.name}" !`,
              {
                position: "top-center",
                duration: 5000,
                icon: <Award className="h-5 w-5 text-primary" />
              }
            );
          } catch (error) {
            console.error("Error awarding badge:", error);
          }
        }
      }
    };
    
    checkForNewBadges();
  }, [todayPoints, badges, earnedBadges, user]);

  const toggleComplete = async (ch: Challenge) => {
    if (!user) return;
    
    try {
      const isCompleted = userChallenges.some(
        uc => uc.challenge_id === ch.id && uc.completed
      );
      
      const today = new Date().toISOString();
      await completeChallenge({
        user_id: user.id,
        challenge_id: ch.id,
        date: today,
        completed: !isCompleted
      });
      
      // Refresh user challenges
      const updatedChallenges = await fetchUserChallenges(user.id);
      setUserChallenges(updatedChallenges);
      
      if (!isCompleted) {
        toast.success(
          `Défi complété ! +${ch.points} points`,
          {
            position: "bottom-right",
            duration: 3000,
          }
        );
      } else {
        toast.info(
          "Défi marqué comme non complété",
          {
            position: "bottom-right",
            duration: 3000,
          }
        );
      }
    } catch (error: any) {
      uiToast({
        title: "Erreur",
        description: `Impossible de mettre à jour le défi: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gamification</h1>
      
      {/* Points and Badges Summary */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-amber-100 p-3 rounded-full mr-4">
                <Trophy className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <div className="text-lg font-medium text-gray-600">Points aujourd'hui</div>
                <div className="text-3xl font-bold">{todayPoints}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-center md:text-right">Badges débloqués</h3>
              <div className="flex flex-wrap justify-center md:justify-end gap-2">
                {earnedBadges.length > 0 ? (
                  earnedBadges.map(eb => {
                    const badge = badges.find(b => b.id === eb.badge_id);
                    return badge ? (
                      <div key={eb.id} className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Award className="h-8 w-8 text-primary" />
                        </div>
                        <span className="text-xs mt-1">{badge.name}</span>
                      </div>
                    ) : null;
                  })
                ) : (
                  <div className="text-sm text-gray-500">Complétez des défis pour gagner des badges</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Daily Challenges */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Défis quotidiens</h2>
        {challenges.length > 0 ? (
          <div className="space-y-4">
            {challenges.map(ch => {
              const isCompleted = userChallenges.some(
                uc => uc.challenge_id === ch.id && uc.completed
              );
              
              return (
                <Card 
                  key={ch.id} 
                  className={`transition-all duration-300 ${isCompleted ? "border-green-500" : ""}`}
                >
                  <CardContent className="flex justify-between items-center p-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        isCompleted ? "bg-green-100" : "bg-gray-100"
                      }`}>
                        {isCompleted ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <Star className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{ch.title}</h3>
                        <p className="text-sm text-muted-foreground">{ch.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded mr-3">
                        {ch.points} pts
                      </div>
                      <Button
                        variant={isCompleted ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleComplete(ch)}
                        aria-label={isCompleted ? "Annuler le défi" : "Valider le défi"}
                      >
                        {isCompleted ? "Annuler" : "Valider"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Aucun défi disponible pour le moment
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Badges to Earn */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Badges à débloquer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map(badge => {
            const isEarned = earnedBadges.some(eb => eb.badge_id === badge.id);
            
            return (
              <Card 
                key={badge.id}
                className={`transition-all duration-300 ${isEarned ? "bg-primary/5 border-primary/30" : ""}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    {badge.name}
                    {isEarned && <div className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded">Obtenu</div>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                  <div className="mt-2 text-sm font-medium">
                    Seuil: {badge.threshold} points
                  </div>
                  {!isEarned && todayPoints > 0 && (
                    <div className="mt-2 bg-gray-100 h-2 rounded-full">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (todayPoints / badge.threshold) * 100)}%` }}
                        aria-label={`Progression: ${Math.min(100, Math.floor((todayPoints / badge.threshold) * 100))}%`}
                      ></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* New Badge Modal */}
      {showNewBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center animate-scale-in">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <Award className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Nouveau Badge Débloqué!</h3>
            <p className="text-lg font-medium mb-1">{showNewBadge.name}</p>
            <p className="text-gray-600 mb-6">{showNewBadge.description}</p>
            <Button onClick={() => setShowNewBadge(null)}>Continuer</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationPage;
