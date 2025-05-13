import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useGamification } from '@/hooks/useGamification';
import { Badge as BadgeType } from '@/types/gamification';
import { motion } from "framer-motion";

const GamificationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("badges");
  const { 
    badges, 
    userPoints, 
    leaderboard, 
    isLoading, 
    error, 
    claimReward, 
    rewards 
  } = useGamification();
  
  const [claimingReward, setClaimingReward] = useState(false);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  
  const handleClaimReward = async (rewardId: string) => {
    setSelectedReward(rewardId);
    setClaimingReward(true);
    
    try {
      await claimReward(rewardId);
    } catch (err) {
      console.error("Error claiming reward:", err);
    } finally {
      setClaimingReward(false);
      setSelectedReward(null);
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Tableau de bord de gamification</h1>
          <p className="text-muted-foreground">
            Suivez vos progrès, débloquez des badges et gagnez des récompenses !
          </p>
        </div>
        
        <Tabs defaultValue="badges" className="w-full mt-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="points">Points</TabsTrigger>
            <TabsTrigger value="leaderboard">Classement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="badges" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes Badges</CardTitle>
                <CardDescription>
                  Collectionnez des badges en atteignant des objectifs et en participant à des activités
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {isLoading ? (
                  <div className="col-span-full flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="col-span-full text-center text-red-500 py-12">
                    Erreur lors du chargement des badges.
                  </div>
                ) : badges && badges.length > 0 ? (
                  badges.map((badge: BadgeType) => (
                    <motion.div
                      key={badge.id}
                      className="overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">{badge.name}</CardTitle>
                          <CardDescription>{badge.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {badge.imageUrl && (
                            <img
                              src={badge.imageUrl}
                              alt={badge.name}
                              className="w-full h-32 object-cover rounded-md"
                            />
                          )}
                          <p className="text-sm text-muted-foreground">
                            Catégorie: {badge.category}
                          </p>
                          {badge.progress !== undefined && badge.progress < 100 && (
                            <>
                              <p className="text-sm">Progression: {badge.progress}%</p>
                              <Progress value={badge.progress} />
                            </>
                          )}
                        </CardContent>
                        <CardFooter className="text-sm">
                          {badge.unlocked ? (
                            <Badge variant="outline">Débloqué</Badge>
                          ) : (
                            <p className="text-muted-foreground">
                              {badge.requirements ? badge.requirements.join(', ') : 'Atteignez les objectifs pour débloquer'}
                            </p>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-muted-foreground py-12">
                    Aucun badge disponible pour le moment.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="points">
            <Card>
              <CardHeader>
                <CardTitle>Mes Points</CardTitle>
                <CardDescription>
                  Gagnez des points en participant à des activités et échangez-les contre des récompenses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500 py-12">
                    Erreur lors du chargement des points.
                  </div>
                ) : (
                  <>
                    <div className="text-5xl font-bold text-center">
                      {userPoints || 0} Points
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Récompenses disponibles</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {rewards && rewards.length > 0 ? (
                          rewards.map(reward => (
                            <Card key={reward.id} className="shadow-sm hover:shadow-md transition-shadow">
                              <CardHeader>
                                <CardTitle>{reward.name}</CardTitle>
                                <CardDescription>{reward.description}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-xl font-semibold">{reward.cost} Points</p>
                              </CardContent>
                              <CardFooter>
                                <Button 
                                  onClick={() => handleClaimReward(reward.id)}
                                  disabled={claimingReward || userPoints < reward.cost}
                                  className="w-full"
                                >
                                  {claimingReward && selectedReward === reward.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Réclamation...
                                    </>
                                  ) : (
                                    `Réclamer pour ${reward.cost} points`
                                  )}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))
                        ) : (
                          <p className="text-muted-foreground">Aucune récompense disponible pour le moment.</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Classement</CardTitle>
                <CardDescription>
                  Voyez comment vous vous situez par rapport aux autres utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500 py-12">
                    Erreur lors du chargement du classement.
                  </div>
                ) : leaderboard && leaderboard.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rang
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Utilisateur
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {leaderboard.map((entry, index) => (
                          <tr key={entry.userId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-100">{index + 1}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-100">{entry.username}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-100">{entry.points}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    Le classement est vide pour le moment.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default GamificationDashboard;
