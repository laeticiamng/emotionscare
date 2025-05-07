
import React, { useEffect } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityLogging } from '@/hooks/useActivityLogging';
import useCoach from '@/hooks/useCoach';
import EmotionMusicVisualizer from '@/components/music/EmotionMusicVisualizer';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Music, Volume } from 'lucide-react';

const CoachPage = () => {
  const { user } = useAuth();
  const { logUserAction } = useActivityLogging('coach');
  const { recommendations, lastEmotion, triggerDailyReminder } = useCoach();
  const { currentTrack, isPlaying, playTrack, pauseTrack, openDrawer } = useMusic();
  
  // Trigger initial recommendations when page loads
  useEffect(() => {
    if (user?.id) {
      logUserAction('visit_coach_page');
      triggerDailyReminder();
    }
  }, [user?.id, logUserAction, triggerDailyReminder]);
  
  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Coach IA</h1>
          <p className="text-muted-foreground">Conseils personnalisés pour améliorer votre bien-être</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
          </div>
          
          <div className="space-y-6">
            {/* Music visualization card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Ambiance musicale</CardTitle>
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
