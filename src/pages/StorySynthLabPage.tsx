
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Sparkles, Wand2, RefreshCw, Download, Share, FileText, Clock, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '@/components/common/PageLayout';
import FeatureCard from '@/components/common/FeatureCard';

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
    <PageLayout
      header={{
        title: 'Story Synth Lab',
        subtitle: 'Laboratoire créatif d\'intelligence artificielle',
        description: 'Transformez vos idées en histoires captivantes grâce à notre IA créative. Explorez différents genres et styles pour créer des récits uniques et personnalisés.',
        icon: BookOpen,
        gradient: 'from-violet-500/20 to-pink-500/5',
        badge: 'IA Créative',
        stats: [
          {
            label: 'Histoires créées',
            value: '156',
            icon: FileText,
            color: 'text-violet-500'
          },
          {
            label: 'Genres disponibles',
            value: '6',
            icon: Sparkles,
            color: 'text-purple-500'
          },
          {
            label: 'Temps moyen',
            value: '3min',
            icon: Clock,
            color: 'text-blue-500'
          },
          {
            label: 'Créativité',
            value: '+85%',
            icon: TrendingUp,
            color: 'text-green-500'
          }
        ],
        actions: [
          {
            label: 'Nouvelle Histoire',
            onClick: () => {
              setUserInput('');
              setGeneratedStory('');
            },
            variant: 'default',
            icon: Wand2
          },
          {
            label: 'Mes Créations',
            onClick: () => console.log('My stories'),
            variant: 'outline',
            icon: BookOpen
          }
        ]
      }}
      tips={{
        title: 'Conseils pour de meilleures histoires',
        items: [
          {
            title: 'Soyez spécifique',
            content: 'Plus votre description est détaillée, plus l\'histoire sera riche et personnalisée',
            icon: Wand2
          },
          {
            title: 'Expérimentez',
            content: 'Testez différents genres et longueurs pour découvrir de nouveaux styles',
            icon: Sparkles
          },
          {
            title: 'Sauvegardez',
            content: 'N\'oubliez pas de télécharger vos histoires favorites pour les relire plus tard',
            icon: Download
          }
        ],
        cta: {
          label: 'Guide de création d\'histoires',
          onClick: () => console.log('Story creation guide')
        }
      }}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Panneau de création */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600" />
              Créateur d'Histoire
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
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
              <label className="block text-sm font-medium text-foreground mb-3">
                Genre d'histoire
              </label>
              <div className="grid grid-cols-2 gap-2">
                {genres.map((genre) => (
                  <Button
                    key={genre.id}
                    variant={selectedGenre === genre.id ? 'default' : 'outline'}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                    onClick={() => setSelectedGenre(genre.id)}
                  >
                    <span className="text-lg">{genre.emoji}</span>
                    <span className="text-xs">{genre.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Longueur d'histoire
              </label>
              <div className="space-y-2">
                {storyLengths.map((length) => (
                  <Button
                    key={length.id}
                    variant={storyLength === length.id ? 'default' : 'outline'}
                    className="w-full justify-start"
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
              className="w-full"
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

        {/* Panneau de résultat */}
        <Card className="h-fit min-h-[500px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
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
                    className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-4"
                  />
                  <p className="text-muted-foreground">Création de votre histoire magique...</p>
                </div>
              </div>
            ) : generatedStory ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="prose prose-violet max-w-none"
              >
                <div className="bg-muted/50 p-6 rounded-lg border">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {generatedStory}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Votre histoire apparaîtra ici une fois générée</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="mt-12 grid md:grid-cols-4 gap-4">
        {[
          { icon: <Wand2 className="w-6 h-6" />, title: 'IA Créative', color: 'from-violet-500 to-purple-500' },
          { icon: <BookOpen className="w-6 h-6" />, title: 'Histoires Uniques', color: 'from-purple-500 to-pink-500' },
          { icon: <Sparkles className="w-6 h-6" />, title: 'Inspiration Infinie', color: 'from-pink-500 to-rose-500' },
          { icon: <Share className="w-6 h-6" />, title: 'Partage Facile', color: 'from-blue-500 to-cyan-500' }
        ].map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description=""
            icon={feature.icon}
            gradient={feature.color}
            className="text-center"
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default StorySynthLabPage;
