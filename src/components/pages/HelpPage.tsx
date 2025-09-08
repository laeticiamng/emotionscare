/**
 * ❓ PAGE D'AIDE
 * Centre d'aide et documentation pour les utilisateurs
 */

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  BookOpen, 
  Video, 
  Mail,
  Phone,
  Heart,
  Brain,
  Music,
  Activity
} from 'lucide-react';

interface HelpPageProps {
  'data-testid'?: string;
}

const HELP_CATEGORIES = [
  {
    id: 'emotion-analysis',
    title: 'Analyse Émotionnelle',
    icon: Brain,
    articles: [
      { title: 'Comment fonctionne l\'analyse émotionnelle ?', time: '3 min' },
      { title: 'Interpréter vos résultats d\'émotion', time: '5 min' },
      { title: 'Conseils pour améliorer votre bien-être', time: '4 min' }
    ]
  },
  {
    id: 'music-therapy',
    title: 'Thérapie Musicale',
    icon: Music,
    articles: [
      { title: 'Générer de la musique avec Suno', time: '6 min' },
      { title: 'Personnaliser vos playlists', time: '4 min' },
      { title: 'Musique adaptative et émotions', time: '7 min' }
    ]
  },
  {
    id: 'wellness',
    title: 'Activités Bien-être',
    icon: Activity,
    articles: [
      { title: 'Exercices de respiration guidée', time: '8 min' },
      { title: 'Méditation et relaxation', time: '5 min' },
      { title: 'Suivi de vos progrès', time: '3 min' }
    ]
  }
];

const FAQ_ITEMS = [
  {
    question: 'Comment commencer avec EmotionsCare ?',
    answer: 'Commencez par créer un compte, puis utilisez notre scanner d\'émotions pour votre première analyse.'
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Oui, toutes vos données personnelles sont chiffrées et nous respectons strictement votre vie privée.'
  },
  {
    question: 'La génération musicale est-elle gratuite ?',
    answer: 'Vous avez droit à 3 générations gratuites par jour. Pour plus, souscrivez à notre abonnement premium.'
  }
];

export default function HelpPage({ 'data-testid': testId }: HelpPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5" data-testid={testId}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Centre d'Aide
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Trouvez rapidement les réponses à vos questions
            </p>
            
            {/* Barre de recherche */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Rechercher dans l'aide..." 
                className="pl-10"
              />
            </div>
          </div>

          {/* Accès rapide */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { 
                icon: MessageCircle, 
                title: 'Chat Support', 
                desc: 'Assistance en temps réel',
                action: 'Discuter maintenant'
              },
              { 
                icon: Video, 
                title: 'Tutoriels Vidéo', 
                desc: 'Guides visuels complets',
                action: 'Voir les vidéos'
              },
              { 
                icon: Mail, 
                title: 'Contact Email', 
                desc: 'Support par email 24/7',
                action: 'Nous contacter'
              }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <item.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{item.desc}</p>
                  <Button variant="outline" size="sm">
                    {item.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Catégories d'aide */}
          <div className="space-y-8 mb-12">
            <h2 className="text-2xl font-bold text-center">Guides par Catégorie</h2>
            
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
              {HELP_CATEGORIES.map(category => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <category.icon className="w-5 h-5 text-primary" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.articles.map((article, index) => (
                        <div 
                          key={index}
                          className="flex justify-between items-center p-2 hover:bg-muted/50 rounded cursor-pointer"
                        >
                          <span className="text-sm">{article.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {article.time}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Questions Fréquentes</h2>
            
            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="text-center mt-12 p-6 bg-primary/5 rounded-lg">
            <Heart className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Vous ne trouvez pas votre réponse ?</h3>
            <p className="text-muted-foreground mb-4">
              Notre équipe de support est là pour vous aider
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button>
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat en Direct
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Envoyer un Email
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}