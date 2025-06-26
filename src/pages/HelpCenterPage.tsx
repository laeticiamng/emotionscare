
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail, 
  Video, 
  FileText, 
  HelpCircle,
  ExternalLink,
  Star,
  ThumbsUp,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  videoUrl?: string;
}

const HelpCenterPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Comment commencer à utiliser EmotionsCare ?',
      answer: 'Pour commencer, créez votre compte, complétez votre profil, puis explorez le scanner émotionnel pour votre première analyse. Notre coach IA vous guidera pas à pas.',
      category: 'getting-started',
      helpful: 24
    },
    {
      id: '2',
      question: 'Le scanner émotionnel est-il précis ?',
      answer: 'Notre scanner utilise des algorithmes avancés d\'IA pour analyser vos réponses et données biométriques. La précision s\'améliore avec l\'utilisation régulière et vos retours.',
      category: 'features',
      helpful: 18
    },
    {
      id: '3',
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons strictement le RGPD et ne partageons jamais vos informations personnelles.',
      category: 'privacy',
      helpful: 32
    },
    {
      id: '4',
      question: 'Comment fonctionne la musicothérapie adaptative ?',
      answer: 'Notre système analyse votre état émotionnel actuel et sélectionne automatiquement des musiques thérapeutiques adaptées à vos besoins du moment.',
      category: 'features',
      helpful: 15
    }
  ];

  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Premiers pas avec EmotionsCare',
      description: 'Guide complet pour débuter sur la plateforme',
      duration: '5 min',
      difficulty: 'beginner',
      category: 'getting-started'
    },
    {
      id: '2',
      title: 'Utiliser le scanner émotionnel',
      description: 'Comment effectuer votre première analyse émotionnelle',
      duration: '3 min',
      difficulty: 'beginner',
      category: 'features'
    },
    {
      id: '3',
      title: 'Configurer vos préférences',
      description: 'Personnaliser votre expérience selon vos besoins',
      duration: '4 min',
      difficulty: 'intermediate',
      category: 'settings'
    },
    {
      id: '4',
      title: 'Tableau de bord avancé',
      description: 'Exploiter toutes les fonctionnalités analytics',
      duration: '8 min',
      difficulty: 'advanced',
      category: 'analytics'
    }
  ];

  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Centre d'Aide</h1>
          <p className="text-muted-foreground text-lg">
            Trouvez les réponses à vos questions et apprenez à utiliser EmotionsCare
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'aide..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold">Chat en direct</h3>
              <p className="text-sm text-muted-foreground">Support instantané</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Mail className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">support@emotionscare.com</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Phone className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold">Téléphone</h3>
              <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Video className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold">Démo</h3>
              <p className="text-sm text-muted-foreground">Session personnalisée</p>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">Questions fréquentes</TabsTrigger>
            <TabsTrigger value="tutorials">Tutoriels</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            {/* Filtres catégories */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                Toutes
              </Button>
              <Button
                variant={selectedCategory === 'getting-started' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('getting-started')}
                size="sm"
              >
                Premiers pas
              </Button>
              <Button
                variant={selectedCategory === 'features' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('features')}
                size="sm"
              >
                Fonctionnalités
              </Button>
              <Button
                variant={selectedCategory === 'privacy' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('privacy')}
                size="sm"
              >
                Confidentialité
              </Button>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQ.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AccordionItem value={item.id} className="border rounded-lg px-6">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <HelpCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <span>{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <p className="text-muted-foreground mb-4">{item.answer}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-muted-foreground">
                            {item.helpful} personnes ont trouvé cela utile
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Cela vous aide-t-il ?
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-6">
            <div className="grid gap-6">
              {filteredTutorials.map((tutorial, index) => (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <Video className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{tutorial.title}</h3>
                            <p className="text-muted-foreground mb-3">{tutorial.description}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{tutorial.duration}</span>
                              </div>
                              <Badge className={getDifficultyColor(tutorial.difficulty)}>
                                {tutorial.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button>
                          Voir le tutoriel
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contacter le Support</CardTitle>
                  <CardDescription>
                    Notre équipe est là pour vous aider
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Chat en direct</h4>
                        <p className="text-sm text-muted-foreground">
                          Disponible 24h/24, 7j/7
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <p className="text-sm text-muted-foreground">
                          Réponse sous 24h
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-orange-500" />
                      <div>
                        <h4 className="font-medium">Téléphone</h4>
                        <p className="text-sm text-muted-foreground">
                          Lun-Ven 9h-18h
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ressources Utiles</CardTitle>
                  <CardDescription>
                    Documentation et guides complémentaires
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <span>Guide d'utilisation complet</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Book className="h-5 w-5 text-indigo-500" />
                      <span>Documentation API</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span>Meilleures pratiques</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
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
