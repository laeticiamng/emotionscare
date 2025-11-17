/**
 * HelpPage - Centre d'aide complet et accessible
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MessageCircle, 
  FileText, 
  Video, 
  Phone, 
  Mail,
  ChevronDown,
  ChevronRight,
  Star,
  Users,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  popular?: boolean;
}

const faqs: FAQItem[] = [
  {
    question: 'Comment utiliser le coach IA ?',
    answer: 'Le coach IA vous accompagne 24h/24. Cliquez sur "Coach" dans le menu, puis décrivez votre situation émotionnelle. L\'IA analysera vos besoins et vous proposera des exercices personnalisés.',
    category: 'IA',
    popular: true
  },
  {
    question: 'Comment fonctionne l\'analyse émotionnelle ?',
    answer: 'Notre scanner utilise l\'IA Hume pour analyser vos émotions via votre voix, expressions faciales ou texte. Les données sont traitées en temps réel pour vous proposer un accompagnement adapté.',
    category: 'Analyse',
    popular: true
  },
  {
    question: 'La musique thérapeutique est-elle incluse ?',
    answer: 'La génération musicale via Suno est incluse dans le plan Premium. Elle crée des compositions personnalisées basées sur votre état émotionnel actuel.',
    category: 'Premium'
  },
  {
    question: 'Comment protégez-vous mes données ?',
    answer: 'Toutes vos données sont chiffrées bout-en-bout. Nous respectons le RGPD et ne partageons jamais vos informations personnelles. Vous pouvez supprimer votre compte à tout moment.',
    category: 'Sécurité',
    popular: true
  },
  {
    question: 'Puis-je utiliser l\'app hors ligne ?',
    answer: 'Certaines fonctionnalités comme les exercices de respiration et le journal sont disponibles hors ligne. L\'IA et l\'analyse émotionnelle nécessitent une connexion.',
    category: 'Technique'
  },
  {
    question: 'Comment modifier mes préférences ?',
    answer: 'Rendez-vous dans Paramètres > Profil pour personnaliser votre expérience, choisir vos notifications et ajuster les paramètres d\'accessibilité.',
    category: 'Paramètres'
  }
];

const guides = [
  {
    title: 'Guide de démarrage',
    description: 'Premiers pas avec EmotionsCare',
    duration: '5 min',
    type: 'Texte',
    icon: FileText,
    popular: true
  },
  {
    title: 'Tutoriel Coach IA',
    description: 'Maximisez votre accompagnement IA',
    duration: '8 min',
    type: 'Vidéo',
    icon: Video
  },
  {
    title: 'Analyses émotionnelles',
    description: 'Comprendre vos rapports',
    duration: '6 min',
    type: 'Texte',
    icon: FileText
  },
  {
    title: 'Paramètres avancés',
    description: 'Personnalisation complète',
    duration: '4 min',
    type: 'Texte',
    icon: FileText
  }
];

const contactOptions = [
  {
    title: 'Chat en direct',
    description: 'Réponse immédiate 24h/24',
    icon: MessageCircle,
    action: 'Démarrer le chat',
    color: 'bg-green-500/10 text-green-600 border-green-200'
  },
  {
    title: 'Email Support',
    description: 'support@emotionscare.com',
    icon: Mail,
    action: 'Envoyer un email',
    color: 'bg-blue-500/10 text-blue-600 border-blue-200'
  },
  {
    title: 'Téléphone',
    description: '+33 1 23 45 67 89',
    icon: Phone,
    action: 'Appeler',
    color: 'bg-purple-500/10 text-purple-600 border-purple-200'
  }
];

interface HelpPageProps {
  'data-testid'?: string;
}

export const HelpPage: React.FC<HelpPageProps> = ({ 'data-testid': testId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = ['Tous', 'IA', 'Analyse', 'Premium', 'Sécurité', 'Technique', 'Paramètres'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-background" data-testid={testId}>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Centre d'aide</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions ou contactez notre équipe support
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Rechercher dans l'aide..."
              className="pl-10 pr-4 py-3 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Rechercher dans l'aide"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Support Rapide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactOptions.map((option) => (
                  <div
                    key={option.title}
                    className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${option.color}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <option.icon className="w-5 h-5" />
                      <span className="font-medium">{option.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      {option.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center p-4">
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Support Actif</div>
              </Card>
              <Card className="text-center p-4">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">&lt;2min</div>
                <div className="text-sm text-muted-foreground">Temps Réponse</div>
              </Card>
              <Card className="text-center p-4">
                <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">4.9/5</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </Card>
              <Card className="text-center p-4">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground">Sécurisé</div>
              </Card>
            </div>

            {/* Guides */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Guides d'utilisation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.map((guide, index) => (
                  <motion.div
                    key={guide.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <guide.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{guide.title}</CardTitle>
                              <CardDescription>{guide.description}</CardDescription>
                            </div>
                          </div>
                          {guide.popular && (
                            <Badge variant="secondary">Populaire</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{guide.type}</span>
                            <span>{guide.duration}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Lire <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Questions fréquentes</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card>
                      <CardHeader
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">{faq.question}</CardTitle>
                            {faq.popular && (
                              <Badge variant="default" className="text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Populaire
                              </Badge>
                            )}
                          </div>
                          <motion.div
                            animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          </motion.div>
                        </div>
                      </CardHeader>
                      <AnimatePresence>
                        {expandedFAQ === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CardContent className="pt-0">
                              <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </p>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
                    <p className="text-muted-foreground mb-4">
                      Essayez d'autres mots-clés ou contactez notre support
                    </p>
                    <Button>Contacter le support</Button>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Additional Resources */}
            <section className="bg-muted/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Ressources supplémentaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Documentation API</h3>
                  <p className="text-muted-foreground mb-4">
                    Intégrez EmotionsCare à vos applications avec notre API complète
                  </p>
                  <Button variant="outline">Voir la documentation</Button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Communauté</h3>
                  <p className="text-muted-foreground mb-4">
                    Rejoignez notre communauté d'utilisateurs et partagez vos expériences
                  </p>
                  <Button variant="outline">Rejoindre Discord</Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};