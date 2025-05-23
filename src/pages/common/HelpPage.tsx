
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Book, 
  Mail, 
  Phone,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqItems = [
    {
      question: 'Comment fonctionne le scanner émotionnel ?',
      answer: 'Le scanner émotionnel utilise l\'intelligence artificielle pour analyser vos expressions, votre voix ou vos écrits et identifier vos émotions. Il vous propose ensuite des recommandations personnalisées.'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Oui, toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons strictement le RGPD et ne partageons jamais vos informations personnelles.'
    },
    {
      question: 'Comment fonctionne la période d\'essai ?',
      answer: 'Vous bénéficiez de 3 jours d\'essai gratuit avec accès complet à toutes les fonctionnalités premium. Aucune carte bancaire n\'est requise pour commencer.'
    },
    {
      question: 'Puis-je utiliser EmotionsCare hors ligne ?',
      answer: 'Certaines fonctionnalités de base sont disponibles hors ligne, mais la plupart des analyses IA nécessitent une connexion internet pour fonctionner.'
    },
    {
      question: 'Comment contacter le support ?',
      answer: 'Vous pouvez nous contacter par email à support@emotionscare.com ou utiliser le chat en direct disponible 24h/7j dans l\'application.'
    }
  ];

  const quickActions = [
    {
      title: 'Guide de démarrage',
      description: 'Découvrez les bases d\'EmotionsCare',
      icon: Book,
      action: () => console.log('Open guide')
    },
    {
      title: 'Chat en direct',
      description: 'Parlez à notre équipe support',
      icon: MessageCircle,
      action: () => console.log('Open chat')
    },
    {
      title: 'Contacter par email',
      description: 'support@emotionscare.com',
      icon: Mail,
      action: () => window.open('mailto:support@emotionscare.com')
    },
    {
      title: 'Assistance téléphonique',
      description: '+33 1 23 45 67 89',
      icon: Phone,
      action: () => window.open('tel:+33123456789')
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Centre d'aide</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
            >
              <Card 
                className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={action.action}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <action.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription className="text-sm">{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Questions fréquentes</CardTitle>
            <CardDescription>
              Trouvez rapidement les réponses aux questions les plus courantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-medium">{item.question}</span>
                    {expandedFaq === index ? (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-3"
                    >
                      <p className="text-slate-600 dark:text-slate-400">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Besoin d'aide supplémentaire ?</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Notre équipe support est disponible 24h/7j pour vous aider
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contacter le support
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HelpPage;
