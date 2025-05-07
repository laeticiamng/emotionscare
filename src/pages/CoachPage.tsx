
import React, { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityLogging } from '@/hooks/useActivityLogging';
import { useCoach } from '@/hooks/coach/useCoach';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Music, Volume, Sparkles } from 'lucide-react';
import MusicRecommendationCard from '@/components/coach/MusicRecommendationCard';
import MusicEmotionSync from '@/components/scan/MusicEmotionSync';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VREmotionRecommendation from '@/components/vr/VREmotionRecommendation';
import { Emotion } from '@/types';
import EnhancedMusicVisualizer from '@/components/music/EnhancedMusicVisualizer';

const CoachPage = () => {
  const { user } = useAuth();
  const { logUserAction } = useActivityLogging('coach');
  const { recommendations, lastEmotion, triggerDailyReminder, sessionScore } = useCoach();
  const { currentTrack, isPlaying, playTrack, pauseTrack, openDrawer } = useMusic();
  const [autoSync, setAutoSync] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  
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
  
  // Create a properly typed emotion object for VREmotionRecommendation 
  const emotionForVR = lastEmotion ? {
    id: 'temp-id',  // Required by the Emotion type
    user_id: user?.id || 'anonymous',
    date: new Date().toISOString(),
    emotion: lastEmotion,
    score: sessionScore || 50
  } as Emotion : null;
  
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
            <Tabs defaultValue="chat" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="chat">Discussion</TabsTrigger>
                <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat">
                <Card className="shadow-lg border-t-4 border-t-primary overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Discussion avec votre coach IA
                    </CardTitle>
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
                <Card className="shadow-lg border-t-4 border-t-primary overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Recommandations personnalisées
                    </CardTitle>
                    <CardDescription>
                      Conseils de bien-être basés sur votre état émotionnel actuel
                      {sessionScore && ` (Score: ${sessionScore}/100)`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recommendations.length > 0 ? (
                      <ul className="space-y-4">
                        {recommendations.map((rec, idx) => (
                          <li key={idx} className="p-4 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors">
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
                        <VREmotionRecommendation emotion={emotionForVR} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            {/* Enhanced Music visualization card */}
            <Card className="overflow-hidden shadow-lg border-t-4" style={{borderTopColor: '#6366F1'}}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-primary" />
                    <span>Ambiance musicale</span>
                  </div>
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
              <CardContent className="p-3">
                <EnhancedMusicVisualizer 
                  emotion={lastEmotion || 'neutral'} 
                  showControls={true}
                />
                
                <div className="mt-4 flex justify-end">
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
            
            {/* Coach recommendations summary */}
            {recommendations.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Recommandations du jour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx} className="p-3 bg-muted/30 rounded-md text-sm hover:bg-muted/40 transition-colors">
                        {rec}
                      </li>
                    ))}
                  </ul>
                  {recommendations.length > 3 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => setActiveTab('recommendations')}
                    >
                      Voir toutes les recommandations
                    </Button>
                  )}
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
