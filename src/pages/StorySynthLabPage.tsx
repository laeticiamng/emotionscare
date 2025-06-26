
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, Wand2, Play } from 'lucide-react';

const StorySynthLabPage: React.FC = () => {
  const [story, setStory] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('aventure');
  const [isGenerating, setIsGenerating] = useState(false);

  const themes = [
    { id: 'aventure', name: 'Aventure', color: 'bg-blue-500' },
    { id: 'mystere', name: 'Mystère', color: 'bg-purple-500' },
    { id: 'romance', name: 'Romance', color: 'bg-pink-500' },
    { id: 'sci-fi', name: 'Science-Fiction', color: 'bg-cyan-500' },
    { id: 'fantaisie', name: 'Fantaisie', color: 'bg-green-500' },
    { id: 'thriller', name: 'Thriller', color: 'bg-red-500' }
  ];

  const generateStory = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setStory(`Dans un monde où la technologie et la magie coexistent, notre héros découvre un secret qui pourrait changer le cours de l'histoire. Cette aventure ${selectedTheme} l'emmènera aux confins de l'imaginable...`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-violet-600 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Story Synth Lab
            </h1>
            <Sparkles className="h-12 w-12 text-violet-600 ml-4" />
          </div>
          <p className="text-xl text-violet-700 max-w-3xl mx-auto">
            Créez des histoires personnalisées avec l'intelligence artificielle pour stimuler votre créativité
          </p>
        </motion.div>

        {/* Sélection de thème */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/80 border-violet-200 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-violet-700 flex items-center">
                <Wand2 className="h-5 w-5 mr-2" />
                Choisissez votre thème
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {themes.map((theme) => (
                  <Badge
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`cursor-pointer p-3 text-center ${
                      selectedTheme === theme.id 
                        ? `${theme.color} text-white` 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {theme.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Générateur d'histoire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/80 border-violet-200 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-violet-700">Votre Histoire Générée</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Votre histoire apparaîtra ici..."
                className="min-h-[200px] mb-4 border-violet-200 focus:border-violet-400"
              />
              <div className="flex gap-4">
                <Button
                  onClick={generateStory}
                  disabled={isGenerating}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Générer une Histoire
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-violet-600 text-violet-600 hover:bg-violet-50"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Écouter
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Options avancées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-white/80 border-violet-200 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-violet-700">Personnalisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-violet-600">Longueur</label>
                  <div className="flex gap-2 mt-1">
                    <Badge className="cursor-pointer bg-violet-600 text-white">Courte</Badge>
                    <Badge className="cursor-pointer bg-gray-200 text-gray-700">Moyenne</Badge>
                    <Badge className="cursor-pointer bg-gray-200 text-gray-700">Longue</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-violet-600">Style</label>
                  <div className="flex gap-2 mt-1">
                    <Badge className="cursor-pointer bg-violet-600 text-white">Narratif</Badge>
                    <Badge className="cursor-pointer bg-gray-200 text-gray-700">Dialogue</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-violet-200 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-violet-700">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                  Sauvegarder l'Histoire
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-violet-600 text-violet-600 hover:bg-violet-50"
                >
                  Partager
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-violet-600 text-violet-600 hover:bg-violet-50"
                >
                  Exporter en PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default StorySynthLabPage;
