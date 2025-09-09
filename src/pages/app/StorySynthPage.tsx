import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Story {
  id: string;
  title: string;
  content: string;
  theme: string;
  duration: number;
  audioUrl?: string;
}

const StorySynthPage = () => {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [selectedTheme, setSelectedTheme] = useState('forest');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const themes = {
    forest: {
      label: 'Forêt Enchantée',
      description: 'Promenades paisibles sous les arbres',
      icon: '🌲',
      color: 'from-green-500 to-emerald-500'
    },
    ocean: {
      label: 'Océan Infini',
      description: 'Vagues douces et horizons apaisants',
      icon: '🌊',
      color: 'from-blue-500 to-cyan-500'
    },
    sky: {
      label: 'Ciel Étoilé',
      description: 'Contemplation nocturne et sérénité',
      icon: '⭐',
      color: 'from-purple-500 to-indigo-500'
    },
    garden: {
      label: 'Jardin Secret',
      description: 'Découverte d\'un havre de paix',
      icon: '🌸',
      color: 'from-pink-500 to-rose-500'
    }
  };

  // Histoires pré-générées par thème
  const sampleStories: Record<string, Story> = {
    forest: {
      id: 'forest-1',
      title: 'La Clairière Dorée',
      content: 'Vous marchez sur un sentier moussu, entouré de grands chênes centenaires. Les rayons du soleil filtrent doucement à travers les feuilles, créant une danse de lumière dorée sur le sol. Un ruisseau murmure tout près, accompagnant vos pas d\'une mélodie cristalline. Vous arrivez dans une clairière circulaire où l\'herbe tendre vous invite à vous reposer. Ici, le temps s\'arrête. Vous respirez profondément l\'air pur et frais, sentant toute tension quitter votre corps. Les oiseaux chantent une berceuse apaisante tandis qu\'une brise légère caresse votre visage.',
      theme: 'forest',
      duration: 180
    },
    ocean: {
      id: 'ocean-1', 
      title: 'La Plage Éternelle',
      content: 'Vos pieds nus touchent le sable fin et chaud d\'une plage déserte. Devant vous, l\'océan s\'étend à l\'infini, d\'un bleu profond et hypnotisant. Les vagues arrivent en rythme régulier, se brisant doucement sur le rivage dans un murmure apaisant. Vous vous asseyez face à l\'horizon, laissant le soleil réchauffer votre peau. Chaque vague qui se retire emporte avec elle vos soucis et vos tensions. Le sel dans l\'air purifie vos pensées. Vous fermez les yeux et vous laissez bercer par cette symphonie naturelle, sentant votre esprit s\'alléger comme une plume dans la brise marine.',
      theme: 'ocean',
      duration: 170
    },
    sky: {
      id: 'sky-1',
      title: 'La Nuit des Étoiles',
      content: 'Allongé sur une couverture douce, vous contemplez la voûte céleste. Des milliers d\'étoiles scintillent au-dessus de vous, formant des constellations mystérieuses. La lune, bienveillante, baigne le paysage d\'une lumière argentée apaisante. L\'air nocturne est frais et pur, portant les parfums subtils de la nuit. Vous sentez la vastitude de l\'univers vous envelopper d\'un sentiment de paix profonde. Chaque étoile semble vous murmurer que vous êtes exactement là où vous devez être. Le silence cosmique berce votre âme et vous vous sentez connecté à quelque chose de plus grand, de plus sage.',
      theme: 'sky',
      duration: 165
    },
    garden: {
      id: 'garden-1',
      title: 'Le Refuge Fleuri',
      content: 'Vous poussez une petite porte de bois et découvrez un jardin secret, caché du monde extérieur. Des roses parfumées grimpent le long des murs de pierre ancienne, mêlant leurs couleurs tendres. Un petit bassin accueille des nénuphars qui flottent paisiblement. Le parfum des lavandes et du jasmin embaume l\'air tiède. Vous vous installez sur un banc de marbre sous une pergola couverte de glycines violettes. Ici, dans ce sanctuaire naturel, votre cœur trouve son rythme apaisé. Les papillons dansent de fleur en fleur, vous rappelant la beauté simple des petits bonheurs. Chaque respiration vous remplit de sérénité.',
      theme: 'garden',
      duration: 175
    }
  };

  // Vérifier le statut offline
  useEffect(() => {
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    updateOnlineStatus();
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const generateStory = async () => {
    setIsGenerating(true);
    
    try {
      // Simulation de génération
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Utiliser l'histoire pré-générée pour le thème
      const story = sampleStories[selectedTheme];
      if (story) {
        setCurrentStory(story);
        setCurrentSentence(0);
        
        if (isOffline) {
          toast.success('Histoire générée (mode hors ligne)', {
            description: 'Lecture texte disponible'
          });
        } else {
          toast.success('Histoire générée avec succès', {
            description: 'Prête pour la lecture audio'
          });
        }
      }
    } catch (error) {
      toast.error('Erreur de génération', {
        description: 'Utilisez une histoire pré-chargée'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const playStory = async () => {
    if (!currentStory) return;

    if (isOffline) {
      // Mode texte uniquement
      setIsPlaying(true);
      startTextReading();
      toast.info('Mode hors ligne', {
        description: 'Lecture texte activée avec sous-titres'
      });
    } else {
      // Simulation lecture audio
      setIsPlaying(true);
      startTextReading();
      toast.success('Lecture audio démarrée', {
        description: 'Installez-vous confortablement'
      });
    }
  };

  const pauseStory = () => {
    setIsPlaying(false);
  };

  const resetStory = () => {
    setIsPlaying(false);
    setCurrentSentence(0);
    setCurrentStory(null);
    toast.info('Histoire terminée', {
      description: 'Que voulez-vous faire maintenant ?'
    });
  };

  const startTextReading = () => {
    if (!currentStory) return;
    
    const sentences = currentStory.content.split('. ');
    let sentenceIndex = 0;
    
    const readNextSentence = () => {
      if (sentenceIndex < sentences.length && isPlaying) {
        setCurrentSentence(sentenceIndex);
        sentenceIndex++;
        
        setTimeout(readNextSentence, 3000); // 3 secondes par phrase
      } else if (sentenceIndex >= sentences.length) {
        setIsPlaying(false);
        toast.success('Histoire terminée !', {
          description: 'Prenez quelques instants pour savourer ce moment de calme'
        });
      }
    };
    
    readNextSentence();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentText = () => {
    if (!currentStory) return '';
    const sentences = currentStory.content.split('. ');
    return sentences[currentSentence] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Story Synth
          </h1>
          <p className="text-slate-300">
            Histoires apaisantes générées pour votre détente
          </p>
          {isOffline && (
            <p className="text-amber-400 text-sm mt-2">
              Mode hors ligne - Lecture texte disponible
            </p>
          )}
        </div>

        {currentStory ? (
          /* Lecteur d'histoire */
          <div className="space-y-6">
            <Card className="p-8 bg-slate-800/30 backdrop-blur-sm border-slate-700">
              <div className="text-center space-y-6">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-3xl">{themes[currentStory.theme as keyof typeof themes]?.icon}</span>
                    <h2 className="text-2xl font-bold text-white">{currentStory.title}</h2>
                  </div>
                  <p className="text-slate-400">
                    Durée estimée : {formatDuration(currentStory.duration)}
                  </p>
                </div>

                {/* Zone de sous-titres */}
                {showSubtitles && isPlaying && (
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
                    <p className="text-lg text-slate-200 leading-relaxed">
                      {getCurrentText()}
                    </p>
                  </div>
                )}

                {/* Texte complet si pas en lecture */}
                {(!isPlaying || !showSubtitles) && (
                  <div className="bg-slate-900/30 p-6 rounded-lg border border-slate-700 max-h-64 overflow-y-auto">
                    <p className="text-slate-300 leading-relaxed text-left">
                      {currentStory.content}
                    </p>
                  </div>
                )}

                {/* Contrôles */}
                <div className="flex justify-center gap-4">
                  {!isPlaying ? (
                    <Button onClick={playStory} size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Play className="w-5 h-5 mr-2" />
                      {isOffline ? 'Lire' : 'Écouter'}
                    </Button>
                  ) : (
                    <Button onClick={pauseStory} variant="secondary" size="lg">
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  <Button onClick={resetStory} variant="outline" size="lg">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Nouvelle histoire
                  </Button>
                </div>
              </div>
            </Card>

            {/* Options */}
            <Card className="p-6 bg-slate-800/30 backdrop-blur-sm border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {showSubtitles ? <Volume2 className="w-5 h-5 text-blue-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
                  <label className="text-white font-medium">Sous-titres</label>
                </div>
                <Switch 
                  checked={showSubtitles}
                  onCheckedChange={setShowSubtitles}
                />
              </div>
            </Card>
          </div>
        ) : (
          /* Sélection de thème */
          <div className="space-y-6">
            <Card className="p-6 bg-slate-800/30 backdrop-blur-sm border-slate-700">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Choisissez votre univers
                </h3>
                
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(themes).map(([key, theme]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span>{theme.icon}</span>
                          <span>{theme.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={generateStory}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Générer l'histoire
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Aperçu du thème sélectionné */}
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(themes).map(([key, theme]) => (
                <Card 
                  key={key} 
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    selectedTheme === key 
                      ? 'bg-slate-700/50 border-blue-500' 
                      : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                  }`}
                  onClick={() => setSelectedTheme(key)}
                >
                  <div className="text-center space-y-3">
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${theme.color} rounded-full flex items-center justify-center text-2xl`}>
                      {theme.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{theme.label}</h4>
                      <p className="text-sm text-slate-400">{theme.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Informations */}
            <Card className="p-6 bg-slate-800/30 backdrop-blur-sm border-slate-700">
              <h3 className="font-semibold text-white mb-4">Comment ça fonctionne</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Histoires apaisantes de 3 à 5 minutes</li>
                <li>• Lecture audio avec sous-titres optionnels</li>
                <li>• Mode hors ligne disponible (texte uniquement)</li>
                <li>• Thèmes variés pour tous les goûts</li>
                <li>• Conçues pour favoriser la relaxation</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorySynthPage;