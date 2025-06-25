
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Sparkles, Share2, Heart, Star, Pen, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const StorySynthLabPage: React.FC = () => {
  const [currentStory, setCurrentStory] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const storyPrompts = [
    {
      id: 'overcome-fear',
      title: 'Surmonter une Peur',
      description: 'Racontez comment vous avez fait face à l\'une de vos plus grandes peurs',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      questions: [
        'Quelle était cette peur et depuis quand l\'aviez-vous ?',
        'Quel élément déclencheur vous a poussé à l\'affronter ?',
        'Quelles stratégies avez-vous utilisées ?',
        'Comment vous sentez-vous maintenant que vous l\'avez surmontée ?'
      ]
    },
    {
      id: 'moment-resilience',
      title: 'Moment de Résilience',
      description: 'Partagez un moment où vous avez rebondi après un échec',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      questions: [
        'Quel était cet échec et comment l\'avez-vous vécu ?',
        'Qu\'avez-vous appris de cette expérience ?',
        'Quelles ressources internes avez-vous découvertes ?',
        'En quoi cela vous a-t-il rendu plus fort ?'
      ]
    },
    {
      id: 'transformation',
      title: 'Transformation Personnelle',
      description: 'Décrivez une période de changement majeur dans votre vie',
      icon: Sparkles,
      color: 'from-purple-500 to-blue-500',
      questions: [
        'Qu\'est-ce qui a déclenché ce changement ?',
        'Quels obstacles avez-vous rencontrés ?',
        'Comment avez-vous navigué cette transition ?',
        'Qui êtes-vous devenu grâce à cette transformation ?'
      ]
    },
    {
      id: 'kindness-impact',
      title: 'Acte de Bienveillance',
      description: 'Partagez un moment où la gentillesse a eu un impact profond',
      icon: Heart,
      color: 'from-yellow-500 to-orange-500',
      questions: [
        'Décrivez cet acte de bienveillance (donné ou reçu)',
        'Quel était le contexte de cette situation ?',
        'Comment cela vous a-t-il affecté émotionnellement ?',
        'Qu\'avez-vous appris sur la nature humaine ?'
      ]
    }
  ];

  const featuredStories = [
    {
      title: 'Le Jour où J\'ai Quitté mon Job Toxique',
      author: 'Marie L.',
      excerpt: 'Après des mois d\'épuisement, j\'ai finalement trouvé le courage de partir. Voici comment j\'ai reconstruit ma vie...',
      likes: 234,
      comments: 45,
      category: 'Transformation',
      readTime: '5 min'
    },
    {
      title: 'Ma Bataille Contre l\'Anxiété Sociale',
      author: 'Thomas R.',
      excerpt: 'De l\'évitement total aux présentations publiques : mon parcours pour surmonter ma peur des autres...',
      likes: 189,
      comments: 67,
      category: 'Peur',
      readTime: '7 min'
    },
    {
      title: 'Quand un Étranger a Changé ma Vie',
      author: 'Sophie M.',
      excerpt: 'Une simple conversation dans le métro qui a transformé ma perspective sur la solitude et la connexion humaine...',
      likes: 312,
      comments: 89,
      category: 'Bienveillance',
      readTime: '4 min'
    }
  ];

  const writingTips = [
    {
      title: 'Soyez Authentique',
      description: 'Partagez votre vérité, même si elle est imparfaite. L\'authenticité touche plus que la perfection.'
    },
    {
      title: 'Montrez, Ne Dites Pas',
      description: 'Utilisez des détails sensoriels et des émotions concrètes pour immerger le lecteur.'
    },
    {
      title: 'Trouvez la Leçon',
      description: 'Chaque expérience porte un enseignement. Qu\'avez-vous appris de cette situation ?'
    },
    {
      title: 'Gardez l\'Espoir',
      description: 'Même dans les moments sombres, montrez comment vous avez trouvé la lumière.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-indigo-600 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Story Synth Lab
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transformez vos expériences en histoires inspirantes. Partagez votre parcours de résilience 
              et inspirez d'autres personnes sur leur chemin de guérison.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-indigo-600">2,847</div>
                <div className="text-sm text-gray-600">Histoires Partagées</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">15,692</div>
                <div className="text-sm text-gray-600">Lectures</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-pink-600">892</div>
                <div className="text-sm text-gray-600">Auteurs Actifs</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">4.9/5</div>
                <div className="text-sm text-gray-600">Impact Moyen</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="write" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
              <TabsTrigger value="write">Écrire</TabsTrigger>
              <TabsTrigger value="discover">Découvrir</TabsTrigger>
              <TabsTrigger value="community">Communauté</TabsTrigger>
              <TabsTrigger value="tips">Conseils</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Story Prompts */}
                <div className="lg:col-span-1 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Prompts d'Inspiration</h2>
                  <div className="space-y-4">
                    {storyPrompts.map((prompt, index) => (
                      <motion.div
                        key={prompt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-300 ${
                            selectedPrompt === prompt.id 
                              ? 'ring-2 ring-indigo-500 shadow-lg' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setSelectedPrompt(prompt.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 bg-gradient-to-r ${prompt.color} rounded-full flex items-center justify-center mr-3`}>
                                <prompt.icon className="h-4 w-4 text-white" />
                              </div>
                              <CardTitle className="text-lg">{prompt.title}</CardTitle>
                            </div>
                            <CardDescription>{prompt.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Writing Area */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="space-y-4">
                      <Input
                        placeholder="Titre de votre histoire..."
                        value={storyTitle}
                        onChange={(e) => setStoryTitle(e.target.value)}
                        className="text-xl font-semibold border-none shadow-none p-0 focus-visible:ring-0"
                      />
                      
                      {selectedPrompt && (
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-indigo-900 mb-2">Questions pour vous guider :</h4>
                          <ul className="space-y-1">
                            {storyPrompts
                              .find(p => p.id === selectedPrompt)
                              ?.questions.map((question, index) => (
                                <li key={index} className="text-sm text-indigo-700">
                                  • {question}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      <Textarea
                        placeholder="Commencez à écrire votre histoire ici... Laissez vos émotions et vos expériences guider vos mots."
                        value={currentStory}
                        onChange={(e) => setCurrentStory(e.target.value)}
                        className="min-h-[400px] border-none shadow-none resize-none focus-visible:ring-0"
                      />

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          {currentStory.length} caractères • {Math.ceil(currentStory.length / 1000)} min de lecture
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline">Sauvegarder</Button>
                          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                            <Share2 className="h-4 w-4 mr-2" />
                            Publier
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discover" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Histoires Inspirantes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredStories.map((story, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{story.category}</Badge>
                            <span className="text-sm text-gray-500">{story.readTime}</span>
                          </div>
                          <CardTitle className="text-lg line-clamp-2">{story.title}</CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            Par {story.author}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                            {story.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Heart className="h-4 w-4 mr-1 text-red-500" />
                                {story.likes}
                              </span>
                              <span className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-1" />
                                {story.comments}
                              </span>
                            </div>
                            <Button variant="ghost" size="sm">Lire</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="community" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-indigo-600" />
                      Événements Communautaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <h4 className="font-semibold">Atelier d'Écriture Thérapeutique</h4>
                      <p className="text-sm text-gray-600">Dimanche 15 Dec • 14h-16h</p>
                      <p className="text-sm">Rejoignez-nous pour un atelier guidé sur l'écriture comme outil de guérison.</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold">Cercle de Partage</h4>
                      <p className="text-sm text-gray-600">Mercredi 18 Dec • 19h-20h30</p>
                      <p className="text-sm">Espace sécurisé pour partager vos histoires en petit groupe.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold">Défi 30 Jours d'Écriture</h4>
                      <p className="text-sm text-gray-600">Janvier 2024</p>
                      <p className="text-sm">Un prompt par jour pour explorer différents aspects de votre parcours.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-500" />
                      Auteurs du Mois
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: 'Claire M.', stories: 12, impact: 4.9 },
                      { name: 'Ahmed K.', stories: 8, impact: 4.8 },
                      { name: 'Lucie R.', stories: 15, impact: 4.7 }
                    ].map((author, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold">{author.name}</div>
                          <div className="text-sm text-gray-600">{author.stories} histoires</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-4 w-4 mr-1" />
                            {author.impact}
                          </div>
                          <div className="text-xs text-gray-500">Impact moyen</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tips" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Conseils d'Écriture Thérapeutique</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {writingTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Pen className="h-5 w-5 mr-2 text-indigo-600" />
                            {tip.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{tip.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default StorySynthLabPage;
