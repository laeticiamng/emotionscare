
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Search, MessageCircle, FileText, Video } from 'lucide-react';

const HelpCenterPage: React.FC = () => {
  const faqCategories = [
    { title: 'Premiers pas', count: 12, icon: '🚀' },
    { title: 'Fonctionnalités', count: 28, icon: '⚡' },
    { title: 'Compte et facturation', count: 15, icon: '💳' },
    { title: 'Confidentialité', count: 8, icon: '🔒' },
    { title: 'Technique', count: 22, icon: '🔧' }
  ];

  const popularArticles = [
    'Comment faire mon premier scan émotionnel ?',
    'Paramétrer mes notifications de bien-être',
    'Comprendre mon score de bien-être',
    'Utiliser le coach IA efficacement',
    'Exporter mes données personnelles'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Centre d'Aide</h1>
          <p className="text-muted-foreground mb-6">Trouvez des réponses à vos questions sur EmotionsCare</p>
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'aide..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {faqCategories.map((category, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary">{category.count} articles</Badge>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Articles Populaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {popularArticles.map((article, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <p className="text-sm">{article}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Voir tous les articles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Besoin d'aide personnalisée ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Notre équipe support est là pour vous aider
              </p>
              
              <div className="space-y-3">
                <Button className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat en direct
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Rendez-vous vidéo
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Ouvrir un ticket
                </Button>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Temps de réponse moyen : 2h en semaine
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
