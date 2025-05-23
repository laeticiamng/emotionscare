
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle, MessageCircle, Mail, Phone, FileText, Search } from 'lucide-react';

const HelpPage: React.FC = () => {
  const helpTopics = [
    {
      title: 'Premiers pas',
      description: 'Comment commencer avec EmotionsCare',
      icon: FileText,
      articles: 8
    },
    {
      title: 'Scanner émotionnel',
      description: 'Utiliser l\'analyse d\'émotions',
      icon: HelpCircle,
      articles: 12
    },
    {
      title: 'Coach IA',
      description: 'Optimiser votre accompagnement',
      icon: MessageCircle,
      articles: 6
    },
    {
      title: 'Musicothérapie',
      description: 'Profiter pleinement des séances',
      icon: FileText,
      articles: 9
    }
  ];

  const faqItems = [
    {
      question: 'Comment fonctionne le scanner émotionnel ?',
      answer: 'Notre IA analyse vos expressions faciales, votre voix ou vos textes pour identifier vos émotions en temps réel.'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Oui, toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons votre confidentialité.'
    },
    {
      question: 'Puis-je utiliser EmotionsCare hors ligne ?',
      answer: 'Certaines fonctionnalités sont disponibles hors ligne, mais une connexion est requise pour l\'analyse IA.'
    },
    {
      question: 'Comment annuler mon abonnement ?',
      answer: 'Vous pouvez annuler votre abonnement à tout moment depuis les paramètres de votre compte.'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Centre d'aide</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Trouvez des réponses à vos questions et optimisez votre expérience EmotionsCare
          </p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Rechercher dans l'aide..."
              className="pl-10 py-6 text-lg"
            />
          </div>
        </motion.div>

        {/* Help Topics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {helpTopics.map((topic, index) => (
            <Card key={topic.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <topic.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-slate-500">{topic.articles} articles</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
                <CardDescription>
                  Les réponses aux questions les plus courantes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
                    <h3 className="font-semibold mb-2">{item.question}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{item.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Contacter le support</CardTitle>
                <CardDescription>
                  Notre équipe est là pour vous aider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat en direct
                    <span className="ml-auto text-green-500 text-xs">Disponible</span>
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email support
                    <span className="ml-auto text-slate-500 text-xs">24h</span>
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Téléphone
                    <span className="ml-auto text-slate-500 text-xs">9h-18h</span>
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold mb-2">Horaires de support</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p>Lundi - Vendredi : 9h00 - 18h00</p>
                    <p>Weekend : 10h00 - 16h00</p>
                    <p>Email : 24h/7j</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Ressources utiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Guide d'utilisation PDF
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Vidéos tutoriels
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Conseils d'experts
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpPage;
