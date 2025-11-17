import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';

interface Story {
  id: string;
  title: string;
  content: string;
  intention: string[];
  audioUrl?: string;
  duration: number;
  isFavorite: boolean;
}

const B2CStorySynthLabPage: React.FC = () => {
  const navigate = useNavigate();
  const { shouldAnimate } = useMotionPrefs();
  
  const [intentions, setIntentions] = useState<string[]>(['', '', '']);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [savedStories, setSavedStories] = useState<Story[]>([
    {
      id: '1',
      title: 'Respiration de la forêt',
      content: 'Dans une clairière baignée de lumière douce...',
      intention: ['calme', 'nature', 'respirer'],
      duration: 240,
      isFavorite: true
    },
    {
      id: '2', 
      title: 'Le refuge des nuages',
      content: 'Vous flotez sur un coussin de vapeur...',
      intention: ['détente', 'nuages', 'flotter'],
      duration: 180,
      isFavorite: false
    }
  ]);

  const generateStory = async () => {
    const validIntentions = intentions.filter(i => i.trim());
    if (validIntentions.length === 0) return;

    setIsGenerating(true);
    
    // Simulation de génération OpenAI + Suno
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockStory: Story = {
      id: Date.now().toString(),
      title: `Histoire de ${validIntentions.join(', ')}`,
      content: `Une histoire apaisante tissée autour de vos mots : ${validIntentions.join(', ')}. 
      
      Vous vous trouvez dans un espace qui respire au rythme de vos pensées. Chaque mot que vous avez choisi résonne doucement dans cet environnement protégé.
      
      ${validIntentions[0]} vous enveloppe comme une couverture de soie...
      ${validIntentions[1] ? `Tandis que ${validIntentions[1]} danse autour de vous...` : ''}
      ${validIntentions[2] ? `Et ${validIntentions[2]} vous guide vers un état de paix profonde.` : ''}
      
      Laissez cette symphonie de sensations vous porter. Votre respiration s'harmonise naturellement avec ce récit qui vous appartient.`,
      intention: validIntentions,
      duration: 200 + validIntentions.length * 60,
      isFavorite: false
    };
    
    setCurrentStory(mockStory);
    setIsGenerating(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const saveStory = () => {
    if (currentStory) {
      setSavedStories(prev => [{ ...currentStory, isFavorite: false }, ...prev]);
    }
  };

  const loadStory = (story: Story) => {
    setCurrentStory(story);
    setIntentions([...story.intention, '', ''].slice(0, 3));
    setPlayTime(0);
    setIsPlaying(false);
  };

  const toggleFavorite = (storyId: string) => {
    setSavedStories(prev => 
      prev.map(story => 
        story.id === storyId 
          ? { ...story, isFavorite: !story.isFavorite }
          : story
      )
    );
  };

  const handleIntentionChange = (index: number, value: string) => {
    setIntentions(prev => {
      const newIntentions = [...prev];
      newIntentions[index] = value;
      return newIntentions;
    });
  };

  // Simulation du timer de lecture
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStory) {
      timer = setInterval(() => {
        setPlayTime(prev => {
          if (prev >= currentStory.duration) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStory]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validIntentions = intentions.filter(i => i.trim());
  const canGenerate = validIntentions.length > 0 && !isGenerating;

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Story Synth Lab</h1>
          <p className="text-sm text-muted-foreground">Récits qui respirent</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Création d'histoire */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            <BookOpen className="h-5 w-5 inline mr-2" />
            3 mots d'intention
          </h2>
          
          <div className="space-y-3 mb-6">
            {intentions.map((intention, index) => (
              <Input
                key={index}
                placeholder={`Mot ${index + 1}${index === 0 ? ' (requis)' : ' (optionnel)'}`}
                value={intention}
                onChange={(e) => handleIntentionChange(index, e.target.value)}
                className="bg-background/50"
              />
            ))}
          </div>

          <Button 
            onClick={generateStory}
            disabled={!canGenerate}
            className="w-full"
          >
            {isGenerating ? 'Tissage en cours...' : 'Tisser l\'histoire'}
          </Button>
        </Card>

        {/* Lecteur d'histoire */}
        {currentStory && (
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {currentStory.title}
              </h3>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                {currentStory.intention.map((word, index) => (
                  <span key={index} className="px-2 py-1 bg-primary/10 rounded-full">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Contrôles audio */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="hover:bg-white/10"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <div className="flex-1 text-center">
                <div className="text-sm text-foreground">
                  {formatTime(playTime)} / {formatTime(currentStory.duration)}
                </div>
                <div className="w-full bg-muted/30 rounded-full h-1 mt-1">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((playTime / currentStory.duration) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="hover:bg-white/10"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>

            {/* Texte de l'histoire */}
            <div className="bg-background/30 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
              <p className="text-sm text-foreground/90 leading-relaxed">
                {currentStory.content}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveStory} variant="outline" className="flex-1">
                Sauvegarder
              </Button>
              <Button onClick={generateStory} variant="ghost">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Collection d'histoires */}
        {savedStories.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Histoires qui font du bien
            </h3>
            <div className="space-y-2">
              {savedStories.map((story) => (
                <Card 
                  key={story.id}
                  className="p-3 bg-card/40 backdrop-blur-sm border-border/30 hover:bg-card/60 transition-all cursor-pointer group"
                  onClick={() => loadStory(story)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          {story.title}
                        </h4>
                        {story.isFavorite && <span className="text-xs">⭐</span>}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {story.intention.map((word, index) => (
                          <span key={index} className="text-xs text-muted-foreground">
                            #{word}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(story.duration)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Option pour ce soir */}
        {currentStory && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="text-center">
              <p className="text-sm text-foreground mb-2">
                Rejouer ce soir en version muette ?
              </p>
              <Button variant="ghost" size="sm" className="text-primary">
                Programmer pour 21h
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default B2CStorySynthLabPage;