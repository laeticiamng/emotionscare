
import React, { useState, useEffect } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, MessageSquare, Music, Heart } from 'lucide-react';
import { useCoach } from '@/hooks/coach/useCoach';
import { useAuth } from '@/contexts/AuthContext';
import { useActivity } from '@/hooks/useActivity';
import EnhancedCoachAI from '@/components/coach/EnhancedCoachAI';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';

const CoachChatPage: React.FC = () => {
  const { user } = useAuth();
  const { logActivity } = useActivity();
  const { triggerDailyReminder, lastEmotion } = useCoach();
  const { openDrawer } = useMusic();
  const [activeTab, setActiveTab] = useState('chat');
  
  useEffect(() => {
    if (user) {
      logActivity('visit_coach_chat_page');
      triggerDailyReminder();
    }
  }, [user, logActivity, triggerDailyReminder]);
  
  return (
    <ProtectedLayout>
      <div className="container mx-auto p-4 max-w-7xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Coach IA - Discussion personnalisée
          </h1>
          <p className="text-muted-foreground mt-1">
            Interagissez avec votre coach IA personnel pour obtenir des conseils adaptés à votre état émotionnel
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Discussion
                </TabsTrigger>
                <TabsTrigger value="bien-etre" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  Bien-être
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="space-y-4">
                <Card className="shadow-lg">
                  <CardContent className="p-0">
                    <EnhancedCoachAI />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bien-etre" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-rose-500" />
                      Activités bien-être recommandées
                    </CardTitle>
                    <CardDescription>
                      Activités personnalisées pour améliorer votre bien-être quotidien
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-muted/30 border">
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">Respiration consciente</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            5 minutes de respiration profonde pour réduire le stress et l'anxiété
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            Démarrer l'exercice
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/30 border">
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">Pause active</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            3 minutes d'étirements simples à faire à votre bureau
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            Voir les exercices
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/30 border">
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">Moment de gratitude</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Noter 3 choses positives qui se sont passées aujourd'hui
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            Ouvrir le journal
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/30 border">
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">Pause musicale</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Écouter une musique apaisante pendant 5 minutes
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={openDrawer}
                          >
                            <Music className="h-4 w-4 mr-2" />
                            Ouvrir le lecteur
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Profil émotionnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h3 className="text-sm font-medium mb-1">État émotionnel actuel</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p>{lastEmotion || 'Neutre'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tendances récentes</h3>
                    <div className="h-32 bg-muted/20 rounded-md flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Graphique des émotions</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Facteurs de stress identifiés</h3>
                    <ul className="space-y-1">
                      <li className="text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>Charge de travail</span>
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>Qualité du sommeil</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Musique adaptée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  Écoutez une playlist spécialement conçue pour votre état émotionnel actuel.
                </p>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={openDrawer}
                >
                  <Music className="h-4 w-4 mr-2" />
                  Ouvrir le lecteur musical
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default CoachChatPage;
