
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  BookOpen, 
  Palette, 
  Wand2, 
  Download, 
  Share2, 
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StorySynthLabPage: React.FC = () => {
  const [storyTitle, setStoryTitle] = useState('');
  const [emotion, setEmotion] = useState('');
  const [setting, setSetting] = useState('');
  const [character, setCharacter] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [storyMood, setStoryMood] = useState<'uplifting' | 'mysterious' | 'adventurous' | 'peaceful'>('uplifting');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const emotions = [
    { name: 'Joie', color: 'bg-yellow-400', emoji: '😊' },
    { name: 'Sérénité', color: 'bg-blue-400', emoji: '😌' },
    { name: 'Courage', color: 'bg-red-400', emoji: '💪' },
    { name: 'Curiosité', color: 'bg-purple-400', emoji: '🤔' },
    { name: 'Gratitude', color: 'bg-green-400', emoji: '🙏' },
    { name: 'Espoir', color: 'bg-orange-400', emoji: '✨' }
  ];
  
  const settings = [
    'Forêt enchantée',
    'Ville futuriste',
    'Château médiéval',
    'Jardin secret',
    'Vaisseau spatial',
    'Café parisien'
  ];
  
  const characters = [
    'Héros courageux',
    'Sage mystérieux',
    'Artiste passionné',
    'Explorateur intrépide',
    'Inventeur génial',
    'Guérisseur bienveillant'
  ];

  const generateStory = async () => {
    if (!emotion || !setting || !character) {
      return;
    }
    
    setIsGenerating(true);
    
    // Simulation de génération d'histoire (en réalité, utiliserait une API d'IA)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const storyTemplate = `Dans ${setting.toLowerCase()}, ${character.toLowerCase()} découvrit quelque chose d'extraordinaire.

L'émotion de ${emotion.toLowerCase()} l'envahit alors qu'il réalisait que cette aventure changerait sa vie à jamais. Les couleurs du monde semblaient plus vives, les sons plus mélodieux, et chaque souffle était empli d'une nouvelle énergie.

"C'est exactement ce que je cherchais", murmura-t-il en contemplant la beauté qui l'entourait. Cette découverte lui rappela que même dans les moments les plus sombres, la lumière trouve toujours un chemin.

L'histoire se termine sur une note d'espoir, montrant que chaque fin est en réalité un nouveau commencement, rempli de possibilités infinies.`;
    
    setGeneratedStory(storyTemplate);
    setIsGenerating(false);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  const shareStory = () => {
    if (navigator.share) {
      navigator.share({
        title: storyTitle || 'Mon Histoire Thérapeutique',
        text: generatedStory
      });
    } else {
      navigator.clipboard.writeText(generatedStory);
      alert('Histoire copiée dans le presse-papiers !');
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
            Story Synth Lab
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Créez des histoires thérapeutiques personnalisées pour votre bien-être émotionnel
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panneau de création */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-purple-400" />
                  Atelier de Création
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre de l'histoire</label>
                  <Input
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="Ex: Mon voyage vers la sérénité"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Émotion centrale</label>
                  <div className="grid grid-cols-2 gap-2">
                    {emotions.map((emotionOption) => (
                      <motion.button
                        key={emotionOption.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEmotion(emotionOption.name)}
                        className={`p-3 rounded-lg border transition-all ${
                          emotion === emotionOption.name
                            ? 'border-purple-400 bg-purple-400/20'
                            : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                        }`}
                      >
                        <div className="text-2xl mb-1">{emotionOption.emoji}</div>
                        <div className="text-sm">{emotionOption.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Décor</label>
                  <div className="grid grid-cols-1 gap-2">
                    {settings.map((settingOption) => (
                      <Button
                        key={settingOption}
                        variant={setting === settingOption ? "default" : "outline"}
                        onClick={() => setSetting(settingOption)}
                        className="justify-start"
                      >
                        {settingOption}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Personnage principal</label>
                  <div className="grid grid-cols-1 gap-2">
                    {characters.map((characterOption) => (
                      <Button
                        key={characterOption}
                        variant={character === characterOption ? "default" : "outline"}
                        onClick={() => setCharacter(characterOption)}
                        className="justify-start"
                      >
                        {characterOption}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={generateStory}
                    disabled={isGenerating || !emotion || !setting || !character}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Sparkles className="h-5 w-5" />
                        </motion.div>
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Générer l'Histoire
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau de résultat */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  Votre Histoire Thérapeutique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {generatedStory ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {storyTitle || 'Histoire Sans Titre'}
                        </h3>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-purple-400 border-purple-400">
                            {emotion}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="prose prose-invert max-w-none">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                          {generatedStory.split('\n\n').map((paragraph, index) => (
                            <motion.p
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.3 }}
                              className="mb-4 text-gray-300 leading-relaxed"
                            >
                              {paragraph}
                            </motion.p>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          onClick={toggleAudio}
                          variant="outline"
                          size="sm"
                        >
                          {audioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          <Volume2 className="ml-1 h-4 w-4" />
                          {audioPlaying ? 'Pause' : 'Écouter'}
                        </Button>
                        
                        <Button
                          onClick={shareStory}
                          variant="outline"
                          size="sm"
                        >
                          <Share2 className="mr-1 h-4 w-4" />
                          Partager
                        </Button>
                        
                        <Button
                          onClick={() => {
                            const element = document.createElement('a');
                            const file = new Blob([generatedStory], { type: 'text/plain' });
                            element.href = URL.createObjectURL(file);
                            element.download = `${storyTitle || 'mon-histoire'}.txt`;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="mr-1 h-4 w-4" />
                          Télécharger
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Votre histoire apparaîtra ici une fois générée</p>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
            
            {/* Instructions thérapeutiques */}
            <Card className="bg-gradient-to-r from-blue-800/30 to-purple-800/30 border-blue-500/30">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Conseil Thérapeutique
                </h4>
                <p className="text-sm text-gray-300">
                  Lisez votre histoire à voix haute ou silencieusement. Visualisez-vous comme le personnage principal 
                  et ressentez l'émotion centrale. Cette pratique aide à intégrer des schémas émotionnels positifs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Audio hidden element for narration */}
        <audio
          ref={audioRef}
          onEnded={() => setAudioPlaying(false)}
          className="hidden"
        >
          <source src="/sounds/ambient-calm.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
};

export default StorySynthLabPage;
