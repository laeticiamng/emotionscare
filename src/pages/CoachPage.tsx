
import React, { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityLogging } from '@/hooks/useActivityLogging';
import { useCoach } from '@/hooks/coach/useCoach';
import EmotionMusicVisualizer from '@/components/music/EmotionMusicVisualizer';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Music, Volume } from 'lucide-react';
import MusicRecommendationCard from '@/components/coach/MusicRecommendationCard';
import MusicEmotionSync from '@/components/scan/MusicEmotionSync';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VREmotionRecommendation from '@/components/vr/VREmotionRecommendation';

const CoachPage = () => {
  const { user } = useAuth();
  const { logUserAction } = useActivityLogging('coach');
  const { recommendations, lastEmotion, triggerDailyReminder, sessionScore } = useCoach();
  const { currentTrack, isPlaying, playTrack, pauseTrack, openDrawer } = useMusic();
  const [autoSync, setAutoSync] = useState(false);
  
  // Trigger initial recommendations when page loads
  useEffect(() => {
    if (user?.id) {
      logUserAction('visit_coach_page');
      triggerDailyReminder();
    }
  }, [user?.id, logUserAction, triggerDailyReminder]);

  // Enable autoSync effect
  const toggleAutoSync = () => {
    setAutoSync(!autoSync);
    logUserAction('toggle_music_sync', { enabled: !autoSync });
  };
  
  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Coach IA</h1>
          <p className="text-muted-foreground">Conseils personnalisés pour améliorer votre bien-être</p>
        </header>
        
        {/* Invisible component for emotion-music synchronization */}
        <MusicEmotionSync emotion={lastEmotion || 'neutral'} autoSync={autoSync} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="chat">Discussion</TabsTrigger>
                <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat">
                <Card>
                  <CardHeader>
                    <CardTitle>Discussion avec votre coach IA</CardTitle>
                    <CardDescription>
                      Posez vos questions et recevez des conseils adaptés à votre situation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ChatInterface />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommandations personnalisées</CardTitle>
                    <CardDescription>
                      Conseils de bien-être basés sur votre état émotionnel actuel
                      {sessionScore && ` (Score: ${sessionScore}/100)`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recommendations.length > 0 ? (
                      <ul className="space-y-4">
                        {recommendations.map((rec, idx) => (
                          <li key={idx} className="p-4 bg-muted/30 rounded-md">
                            <p>{rec}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center p-6 bg-muted/20 rounded-md">
                        <p>Aucune recommandation disponible pour le moment</p>
                        <Button 
                          onClick={triggerDailyReminder} 
                          variant="outline" 
                          className="mt-4"
                        >
                          Générer des recommandations
                        </Button>
                      </div>
                    )}
                    
                    {/* VR recommendation based on emotion */}
                    {lastEmotion && (
                      <div className="mt-6">
                        <VREmotionRecommendation emotion={{ emotion: lastEmotion, score: sessionScore || 50 }} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            {/* Music visualization card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Ambiance musicale</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAutoSync}
                    className={`text-xs ${autoSync ? 'bg-primary/20 text-primary' : ''}`}
                  >
                    {autoSync ? 'Sync auto ON' : 'Sync auto OFF'}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Musique adaptée à votre état émotionnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmotionMusicVisualizer emotion={lastEmotion || 'neutral'} />
                
                <div className="mt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => isPlaying ? pauseTrack() : (currentTrack && playTrack(currentTrack))}
                  >
                    {isPlaying ? 'Pause' : 'Lecture'}
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={openDrawer}
                  >
                    <Music className="h-4 w-4 mr-2" />
                    Ouvrir le lecteur
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Music recommendation */}
            <MusicRecommendationCard emotion={lastEmotion || 'neutral'} />
            
            {/* Coach recommendations */}
            {recommendations.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recommandations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx} className="p-3 bg-muted/30 rounded-md text-sm">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default CoachPage;
