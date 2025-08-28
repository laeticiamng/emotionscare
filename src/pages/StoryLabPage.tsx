import React from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Wand2, Play } from 'lucide-react';
import { useStorySession } from '@/hooks/useStorySession';
import StoryCanvas from '@/components/story/StoryCanvas';
import ChoiceList from '@/components/story/ChoiceList';
import AudioDirector from '@/components/story/AudioDirector';
import PosterArt from '@/components/story/PosterArt';
import CheckpointBar from '@/components/story/CheckpointBar';
import ExportButton from '@/components/story/ExportButton';

const StoryLabPage: React.FC = () => {
  const { state, start, sendChoice, resumeNarration } = useStorySession();

  const handleGenreSelect = (genre: 'space' | 'medieval' | 'cyber') => {
    start({ genre, language: 'fr', intensity: 'epic' });
  };

  if (state.phase === 'idle') {
    return (
      <div className="min-h-screen bg-background">
        <UnifiedShell>
          <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Story Synth Lab</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Créez une histoire audio immersive interactive où vos choix façonnent la narration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { id: 'space', name: 'Espace', icon: '🚀', desc: 'Aventure galactique' },
                { id: 'medieval', name: 'Médiéval', icon: '⚔️', desc: 'Quête épique' },
                { id: 'cyber', name: 'Cyberpunk', icon: '🤖', desc: 'Futur dystopique' }
              ].map((genre) => (
                <Card key={genre.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{genre.icon}</div>
                    <h3 className="font-semibold mb-2">{genre.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{genre.desc}</p>
                    <Button onClick={() => handleGenreSelect(genre.id as any)} className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Lancer l'histoire
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </UnifiedShell>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Story Synth Lab</h1>
                <Badge variant="secondary">
                  {state.genre} • {state.isConnected ? 'Connecté' : 'Déconnecté'}
                </Badge>
              </div>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Nouvelle histoire
            </Button>
          </div>

          <CheckpointBar 
            currentAct={state.currentAct} 
            totalChapters={state.chapters.length} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <StoryCanvas chapter={state.chapter} />
              {state.choices.length > 0 && (
                <ChoiceList 
                  items={state.choices} 
                  onSelect={sendChoice}
                  disabled={state.phase !== 'choosing'}
                />
              )}
              {state.error && !state.isConnected && (
                <Card className="border-destructive">
                  <CardContent className="p-4 text-center">
                    <p className="text-destructive mb-2">Connexion perdue</p>
                    <Button onClick={resumeNarration} size="sm">
                      Reprendre la narration
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <PosterArt 
                src={state.coverUrl || state.chapter?.art_url} 
                downloadable={true}
              />
              <AudioDirector src={state.music?.track_url} />
              <ExportButton variant="card" />
            </div>
          </div>
        </div>
      </UnifiedShell>
    </div>
  );
};

export default StoryLabPage;