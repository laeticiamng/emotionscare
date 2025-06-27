
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Sparkles, Wand2, RefreshCw, Download, Share } from 'lucide-react';
import { toast } from 'sonner';

const StorySynthLabPage: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('fantasy');
  const [storyLength, setStoryLength] = useState('short');

  const genres = [
    { id: 'fantasy', name: 'Fantasy', emoji: '🧙‍♂️', description: 'Mondes magiques et créatures fantastiques' },
    { id: 'scifi', name: 'Science-Fiction', emoji: '🚀', description: 'Futur, technologie et exploration spatiale' },
    { id: 'romance', name: 'Romance', emoji: '💕', description: 'Histoires d\'amour et relations humaines' },
    { id: 'mystery', name: 'Mystère', emoji: '🔍', description: 'Enigmes, suspense et investigations' },
    { id: 'adventure', name: 'Aventure', emoji: '🗺️', description: 'Voyages épiques et découvertes' },
    { id: 'wellness', name: 'Bien-être', emoji: '🌸', description: 'Histoires apaisantes et inspirantes' }
  ];

  const storyLengths = [
    { id: 'micro', name: 'Micro-histoire', duration: '1-2 min', words: '100-200 mots' },
    { id: 'short', name: 'Histoire courte', duration: '3-5 min', words: '300-500 mots' },
    { id: 'medium', name: 'Récit moyen', duration: '8-10 min', words: '800-1000 mots' }
  ];

  const generateStory = async () => {
    if (!userInput.trim()) {
      toast.error('Veuillez entrer une idée ou un thème pour votre histoire');
      return;
    }

    setIsGenerating(true);
    
    // Simulation de génération d'histoire IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const sampleStory = `Dans un monde où les émotions prenaient forme de lumière colorée, Luna découvrit qu'elle pouvait tisser ces rayons en histoires vivantes.

Chaque matin, elle se rendait au Laboratoire des Récits, un lieu magique où les pensées se transformaient en aventures extraordinaires. Aujourd'hui, inspirée par "${userInput}", elle commença à tisser une histoire unique.

Les couleurs dansaient autour d'elle : le bleu profond de la mélancolie, l'or étincelant de la joie, le rouge passionné de l'amour. Ses mains expertes guidaient ces teintes émotionnelles, créant un récit qui toucherait le cœur de tous ceux qui l'entendraient.

L'histoire qu'elle créa parlait de transformation, de découverte de soi et de la beauté cachée dans chaque émotion humaine. Car Luna savait que les meilleures histoires naissent du cœur et parlent à l'âme.

Quand elle termina son œuvre, les couleurs se cristallisèrent en un livre lumineux, prêt à apporter inspiration et réconfort à celui qui le lirait.`;

    setGeneratedStory(sampleStory);
    setIsGenerating(false);
    toast.success('Histoire générée avec succès ! ✨');
  };

  const saveStory = () => {
    const blob = new Blob([generatedStory], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mon-histoire-synthlab.txt';
    a.click();
    toast.success('Histoire sauvegardée !');
  };

  const shareStory = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mon histoire du Story Synth Lab',
        text: generatedStory,
      });
    } else {
      navigator.clipboard.writeText(generatedStory);
      toast.success('Histoire copiée dans le presse-papiers !');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-violet-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Story Synth Lab
            </h1>
            <Wand2 className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Créez des histoires personnalisées avec l'intelligence artificielle créative
          </p>
          <Badge variant="secondary" className="mt-4 bg-violet-100 text-violet-700">
            Laboratoire Créatif
          </Badge>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panneau de création */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  Créateur d'Histoire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre idée ou thème
                  </label>
                  <Textarea
                    placeholder="Décrivez votre idée d'histoire, un personnage, une situation, ou laissez libre cours à votre imagination..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Genre d'histoire
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {genres.map((genre) => (
                      <Button
                        key={genre.id}
                        variant={selectedGenre === genre.id ? 'default' : 'outline'}
                        className={`h-auto p-3 flex flex-col items-center gap-1 ${
                          selectedGenre === genre.id 
                            ? 'bg-violet-600 hover:bg-violet-700' 
                            : 'hover:bg-violet-50'
                        }`}
                        onClick={() => setSelectedGenre(genre.id)}
                      >
                        <span className="text-lg">{genre.emoji}</span>
                        <span className="text-xs">{genre.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Longueur d'histoire
                  </label>
                  <div className="space-y-2">
                    {storyLengths.map((length) => (
                      <Button
                        key={length.id}
                        variant={storyLength === length.id ? 'default' : 'outline'}
                        className={`w-full justify-start ${
                          storyLength === length.id 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : 'hover:bg-purple-50'
                        }`}
                        onClick={() => setStoryLength(length.id)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{length.name}</div>
                          <div className="text-xs opacity-75">{length.duration} • {length.words}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generateStory}
                  disabled={isGenerating || !userInput.trim()}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Générer mon Histoire
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Panneau de résultat */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-fit min-h-[500px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    Votre Histoire
                  </CardTitle>
                  {generatedStory && (
                    <div className="flex gap-2">
                      <Button
                        onClick={saveStory}
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={shareStory}
                        variant="outline"
                        size="sm"
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full mx-auto mb-4"
                      />
                      <p className="text-gray-600">Création de votre histoire magique...</p>
                    </div>
                  </div>
                ) : generatedStory ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="prose prose-violet max-w-none"
                  >
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-lg border-2 border-violet-200">
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {generatedStory}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Votre histoire apparaîtra ici une fois générée</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 grid md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
            <Wand2 className="w-6 h-6 text-violet-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800 text-sm">IA Créative</h4>
          </div>
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800 text-sm">Histoires Uniques</h4>
          </div>
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-pink-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800 text-sm">Inspiration Infinie</h4>
          </div>
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
            <Share className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800 text-sm">Partage Facile</h4>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StorySynthLabPage;
