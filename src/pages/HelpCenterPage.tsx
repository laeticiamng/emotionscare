
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  MessageCircle, 
  Book, 
  Video, 
  FileText, 
  HelpCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tout', icon: Book, count: 47 },
    { id: 'getting-started', label: 'Démarrage', icon: Star, count: 12 },
    { id: 'features', label: 'Fonctionnalités', icon: CheckCircle, count: 18 },
    { id: 'account', label: 'Compte', icon: Star, count: 8 },
    { id: 'troubleshooting', label: 'Problèmes', icon: HelpCircle, count: 9 }
  ];

  const popularArticles = [
    {
      id: 1,
      title: 'Comment effectuer votre premier scan émotionnel',
      description: 'Guide étape par étape pour commencer avec EmotionsCare',
      category: 'getting-started',
      readTime: '3 min',
      views: 1234,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Personnaliser vos recommandations musicales',
      description: 'Optimisez votre expérience musicale selon vos émotions',
      category: 'features',
      readTime: '5 min',
      views: 987,
      rating: 4.7
    },
    {
      id: 3,
      title: 'Utiliser le coach IA pour un accompagnement personnalisé',
      description: 'Maximisez l\'efficacité de votre coach virtuel',
      category: 'features',
      readTime: '4 min',
      views: 876,
      rating: 4.9
    },
    {
      id: 4,
      title: 'Configurer vos paramètres de confidentialité',
      description: 'Protégez vos données personnelles et émotionnelles',
      category: 'account',
      readTime: '2 min',
      views: 654,
      rating: 4.6
    }
  ];

  const faqItems = [
    {
      question: 'Comment fonctionne le scan émotionnel ?',
      answer: 'Notre technologie d\'analyse émotionnelle utilise l\'IA pour détecter votre état émotionnel à travers différents indicateurs : expressions faciales, ton de voix, et réponses aux questionnaires. Ces données sont ensuite analysées pour vous proposer des recommandations personnalisées.'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Absolument. Toutes vos données sont chiffrées et stockées selon les normes RGPD. Vous avez un contrôle total sur vos informations et pouvez les exporter ou les supprimer à tout moment.'
    },
    {
      question: 'Puis-je utiliser EmotionsCare hors ligne ?',
      answer: 'Certaines fonctionnalités comme la musique téléchargée et les exercices de respiration sont disponibles hors ligne. Cependant, les analyses en temps réel et le coach IA nécessitent une connexion internet.'
    },
    {
      question: 'Comment annuler mon abonnement ?',
      answer: 'Vous pouvez annuler votre abonnement à tout moment dans les paramètres de votre compte. L\'annulation prendra effet à la fin de votre période de facturation actuelle.'
    },
    {
      question: 'Puis-je partager mes données avec mon thérapeute ?',
      answer: 'Oui, vous pouvez générer des rapports détaillés et les partager avec votre professionnel de santé. Cette fonctionnalité est entièrement optionnelle et sous votre contrôle.'
    }
  ];

  const tutorials = [
    {
      title: 'Démarrage rapide',
      description: 'Découvrez EmotionsCare en 5 minutes',
      duration: '5:30',
      thumbnail: '/api/placeholder/320/180'
    },
    {
      title: 'Maîtriser le scan émotionnel',
      description: 'Techniques avancées pour des analyses précises',
      duration: '8:45',
      thumbnail: '/api/placeholder/320/180'
    },
    {
      title: 'Optimiser votre bien-être',
      description: 'Stratégies pour maximiser vos résultats',
      duration: '12:20',
      thumbnail: '/api/placeholder/320/180'
    }
  ];

  const filteredArticles = popularArticles.filter(article => 
    (selectedCategory === 'all' || article.category === selectedCategory) &&
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-4xl font-bold mb-4">Centre d'aide</h1>
            <p className="text-xl text-muted-foreground">
              Trouvez rapidement des réponses à vos questions
            </p>
          </motion.div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="articles" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Tutoriels
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                    <Badge variant="secondary" className="ml-1">
                      {category.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline">{article.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {article.rating}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{article.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {article.readTime}
                          </div>
                          <span>{article.views} vues</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-500 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="h-12 w-12 text-white" />
                      </div>
                      <Badge className="absolute top-2 right-2 bg-black/50">
                        {tutorial.duration}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                      <p className="text-muted-foreground text-sm">{tutorial.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Questions fréquemment posées</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Contactez-nous</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg border">
                    <MessageCircle className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">Chat en direct</h4>
                      <p className="text-sm text-muted-foreground">Réponse immédiate</p>
                    </div>
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg border">
                    <Mail className="h-8 w-8 text-green-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">Email</h4>
                      <p className="text-sm text-muted-foreground">support@emotionscare.com</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Écrire
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg border">
                    <Phone className="h-8 w-8 text-purple-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">Téléphone</h4>
                      <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Appeler
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card>
                <CardHeader>
                  <CardTitle>Heures d'ouverture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Lundi - Vendredi</span>
                      <span className="text-green-600 font-medium">9h00 - 18h00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Samedi</span>
                      <span className="text-green-600 font-medium">10h00 - 16h00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dimanche</span>
                      <span className="text-muted-foreground">Fermé</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-600">Temps de réponse moyen</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Chat: Immédiat • Email: 2-4 heures • Téléphone: Immédiat
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpCenterPage;
