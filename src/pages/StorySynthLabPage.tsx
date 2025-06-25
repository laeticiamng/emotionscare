
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Sparkles, Image, Wand2, Share2, Download, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const StorySynthLabPage = () => {
  const [storyPrompt, setStoryPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const genres = [
    'Aventure', 'Fantasy', 'Science-Fiction', 'Romance', 'Mystère', 
    'Thriller', 'Comédie', 'Drame', 'Histoire vraie', 'Fable'
  ];

  const tones = [
    'Inspirant', 'Mystérieux', 'Humoristique', 'Dramatique', 
    'Romantique', 'Aventureux', 'Réfléchi', 'Énergique'
  ];

  const storyTemplates = [
    {
      title: "Le Héros Inattendu",
      description: "Une personne ordinaire découvre des pouvoirs extraordinaires",
      genre: "Aventure",
      preview: "Dans une petite ville tranquille, Marie, bibliothécaire de 32 ans, découvre qu'elle peut..."
    },
    {
      title: "L'Île Mystérieuse", 
      description: "Exploration d'une île cachée aux secrets anciens",
      genre: "Mystère",
      preview: "Le bateau s'échoue sur une île qui n'apparaît sur aucune carte. Les arbres murmurent..."
    },
    {
      title: "Voyage dans le Temps",
      description: "Un voyage accidentel vers une époque différente",
      genre: "Science-Fiction", 
      preview: "L'expérience tourne mal et soudain, les rues pavées remplacent l'asphalte moderne..."
    }
  ];

  const recentStories = [
    {
      title: "La Clé du Temps",
      genre: "Fantasy",
      createdAt: "Il y a 2h",
      length: "850 mots",
      rating: 4.5
    },
    {
      title: "Robot et Humanité",
      genre: "Science-Fiction",
      createdAt: "Hier",
      length: "1200 mots", 
      rating: 4.8
    },
    {
      title: "Le Jardin Secret",
      genre: "Drame",
      createdAt: "Il y a 3 jours",
      length: "950 mots",
      rating: 4.2
    }
  ];

  const generateStory = async () => {
    if (!storyPrompt.trim() || !selectedGenre) return;
    
    setIsGenerating(true);
    
    // Simulation de génération (remplacer par appel API réel)
    setTimeout(() => {
      const sampleStory = `# ${storyPrompt}

Dans un monde où ${selectedGenre.toLowerCase()} rencontre l'imagination, votre histoire commence...

**Chapitre 1: Le Commencement**

${storyPrompt} - cette simple phrase allait changer le cours de l'histoire. Marie regardait par la fenêtre de son appartement parisien, ne se doutant pas que sa vie ordinaire était sur le point de basculer dans l'extraordinaire.

La pluie tambourinait contre les carreaux, créant des motifs hypnotiques qui semblaient former des symboles mystérieux. Était-ce son imagination qui lui jouait des tours, ou y avait-il vraiment quelque chose de différent dans cette soirée d'octobre ?

**Choix 1:** 
A) Sortir sous la pluie pour examiner les symboles de plus près
B) Fermer les rideaux et préparer une tasse de thé
C) Prendre une photo des motifs sur la vitre

Soudain, son téléphone vibra. Un message d'un numéro inconnu : "Le temps est venu. Rendez-vous au café de la rue Saint-Antoine à minuit. Venez seule."

**Chapitre 2: La Révélation**

Le café était étrangement désert pour un vendredi soir. Seule une silhouette encapuchonnée était assise dans le fond, près de la fenêtre. Marie hésita un instant avant de s'approcher.

"Vous cherchez des réponses", dit la voix sous la capuche. "Et moi, j'ai des questions. Nous pouvons nous entraider."

L'histoire continue de se déployer, mêlant mystère et aventure, guidée par vos choix et votre imagination...

**Fin du Chapitre 2**

*Que se passe-t-il ensuite ? C'est à vous de décider...*`;
      
      setGeneratedStory(sampleStory);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="secondary" className="mb-4 bg-purple-600">
            <BookOpen className="h-4 w-4 mr-2" />
            Story Synth Lab
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Créez Vos Histoires Interactives
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transformez vos idées en récits captivants grâce à l'intelligence artificielle et votre créativité.
          </p>
        </motion.div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="create" className="data-[state=active]:bg-purple-600">
              Créer
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-purple-600">
              Modèles
            </TabsTrigger>
            <TabsTrigger value="library" className="data-[state=active]:bg-purple-600">
              Bibliothèque
            </TabsTrigger>
            <TabsTrigger value="share" className="data-[state=active]:bg-purple-600">
              Partager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-purple-400" />
                    Générateur d'Histoire
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Décrivez votre idée et laissez l'IA créer votre histoire
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Votre idée d'histoire
                    </label>
                    <Textarea
                      placeholder="Ex: Une detective découvre que son partenaire cache un secret surnaturel..."
                      value={storyPrompt}
                      onChange={(e) => setStoryPrompt(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Genre
                      </label>
                      <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Choisir un genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Ton
                      </label>
                      <Select value={selectedTone} onValueChange={setSelectedTone}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Choisir un ton" />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map((tone) => (
                            <SelectItem key={tone} value={tone}>
                              {tone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Image d'inspiration (optionnel)
                    </label>
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                      <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400">
                        Glissez une image ou cliquez pour parcourir
                      </p>
                      <Input type="file" className="hidden" accept="image/*" />
                    </div>
                  </div>

                  <Button 
                    onClick={generateStory}
                    disabled={!storyPrompt.trim() || !selectedGenre || isGenerating}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Générer l'Histoire
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-pink-400" />
                    Histoire Générée
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Votre récit interactif apparaîtra ici
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedStory ? (
                    <div className="space-y-4">
                      <div className="bg-slate-700/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <div className="prose prose-invert max-w-none text-sm">
                          {generatedStory.split('\n').map((line, index) => (
                            <p key={index} className="mb-2 text-gray-300">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Lire
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4 mr-2" />
                          Partager
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Votre histoire apparaîtra ici après génération</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storyTemplates.map((template, index) => (
                <motion.div
                  key={template.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-purple-600 text-white">
                          {template.genre}
                        </Badge>
                      </div>
                      <CardTitle className="text-white">{template.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-slate-700/50 rounded p-3 mb-4">
                        <p className="text-sm text-gray-300 italic">
                          "{template.preview}"
                        </p>
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Utiliser ce modèle
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Mes Histoires</CardTitle>
                <CardDescription className="text-gray-400">
                  Retrouvez toutes vos créations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStories.map((story, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{story.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{story.genre}</span>
                            <span>{story.length}</span>
                            <span>{story.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-300">{story.rating}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Ouvrir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="share" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Partagez Vos Créations</CardTitle>
                <CardDescription className="text-gray-400">
                  Faites découvrir vos histoires à la communauté
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <Share2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Fonctionnalité bientôt disponible
                </h3>
                <p className="text-gray-400 mb-6">
                  Vous pourrez bientôt partager vos histoires avec d'autres créateurs
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  M'informer du lancement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StorySynthLabPage;
