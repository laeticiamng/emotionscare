
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle, Search, Book, MessageSquare, Video, FileText, ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

interface Article {
  id: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  icon: React.ReactNode;
}

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'Tout', count: 45 },
    { id: 'getting-started', name: 'Premiers pas', count: 12 },
    { id: 'features', name: 'Fonctionnalités', count: 18 },
    { id: 'account', name: 'Compte', count: 8 },
    { id: 'billing', name: 'Facturation', count: 5 },
    { id: 'technical', name: 'Technique', count: 7 }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Comment commencer mon premier scan émotionnel ?',
      answer: 'Pour effectuer votre premier scan émotionnel, rendez-vous dans la section "Scanner" depuis le menu principal. Suivez les instructions à l\'écran : positionnez-vous face à votre caméra, parlez naturellement pendant 30 secondes, et notre IA analysera vos émotions en temps réel.',
      category: 'getting-started',
      helpful: 23,
      notHelpful: 2
    },
    {
      id: '2',
      question: 'Mes données personnelles sont-elles sécurisées ?',
      answer: 'Oui, absolument. EmotionsCare respecte la conformité RGPD et utilise un chiffrement de bout en bout. Vos données émotionnelles sont anonymisées et stockées de façon sécurisée. Vous pouvez consulter notre politique de confidentialité pour plus de détails.',
      category: 'account',
      helpful: 45,
      notHelpful: 1
    },
    {
      id: '3',
      question: 'Comment fonctionne le coaching IA ?',
      answer: 'Notre coach IA analyse vos patterns émotionnels et vous propose des recommandations personnalisées. Il apprend de vos interactions pour adapter ses conseils à votre profil unique. Vous pouvez discuter avec lui à tout moment via l\'interface de chat.',
      category: 'features',
      helpful: 38,
      notHelpful: 5
    },
    {
      id: '4',
      question: 'Puis-je utiliser l\'application hors ligne ?',
      answer: 'Certaines fonctionnalités sont disponibles hors ligne, comme la consultation de votre historique et les exercices de respiration de base. Cependant, les scans émotionnels et le coaching IA nécessitent une connexion internet.',
      category: 'technical',
      helpful: 19,
      notHelpful: 8
    }
  ];

  const articles: Article[] = [
    {
      id: '1',
      title: 'Guide complet du scan émotionnel',
      description: 'Apprenez à utiliser efficacement notre technologie de reconnaissance émotionnelle',
      readTime: '5 min',
      category: 'getting-started',
      icon: <Video className="w-5 h-5" />
    },
    {
      id: '2',
      title: 'Optimiser votre bien-être avec l\'IA',
      description: 'Conseils pour tirer le meilleur parti du coaching personnalisé',
      readTime: '8 min',
      category: 'features',
      icon: <Book className="w-5 h-5" />
    },
    {
      id: '3',
      title: 'Paramètres de confidentialité avancés',
      description: 'Contrôlez précisément vos données et votre vie privée',
      readTime: '3 min',
      category: 'account',
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            <HelpCircle className="w-4 h-4 mr-2" />
            Centre d'Aide EmotionsCare
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trouvez rapidement des réponses à vos questions ou contactez notre équipe support.
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">Chat en Direct</h3>
              <p className="text-muted-foreground mb-4">Parlez à un expert en temps réel</p>
              <Button className="w-full">Démarrer le chat</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Video className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold mb-2">Tutoriels Vidéo</h3>
              <p className="text-muted-foreground mb-4">Guides visuels étape par étape</p>
              <Button variant="outline" className="w-full">Voir les vidéos</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Book className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-semibold mb-2">Documentation</h3>
              <p className="text-muted-foreground mb-4">Guides détaillés et API</p>
              <Button variant="outline" className="w-full">Consulter les docs</Button>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Catégories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq">Questions Fréquentes</TabsTrigger>
            <TabsTrigger value="articles">Articles d'Aide</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <div className="space-y-4">
              {filteredFAQ.map((faq) => (
                <Card key={faq.id} className="hover:shadow-md transition-shadow">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                      <ChevronRight 
                        className={`w-5 h-5 transition-transform ${
                          expandedFAQ === faq.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </CardHeader>
                  {expandedFAQ === faq.id && (
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-muted-foreground">Cette réponse vous a-t-elle été utile ?</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Oui ({faq.helpful})
                          </Button>
                          <Button variant="outline" size="sm">
                            <ThumbsDown className="w-4 h-4 mr-1" />
                            Non ({faq.notHelpful})
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {article.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                        <p className="text-muted-foreground text-sm">{article.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{article.readTime}</Badge>
                      <Button variant="ghost" size="sm">
                        Lire l'article
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Support */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Besoin d'aide supplémentaire ?</h2>
            <p className="text-blue-100 mb-6">
              Notre équipe support est là pour vous accompagner. Contactez-nous pour une assistance personnalisée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contacter le support
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                Planifier un appel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenterPage;
