
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  HelpCircle, Search, MessageCircle, BookOpen, 
  Mail, Phone, Clock, Users, ChevronDown, ChevronRight 
} from 'lucide-react';
import { toast } from 'sonner';

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });

  const faqItems = [
    {
      question: 'Comment fonctionne le scanner d\'émotions ?',
      answer: 'Notre scanner d\'émotions utilise l\'IA pour analyser vos textes, votre voix ou vos réactions. Il identifie les émotions dominantes et vous propose des recommandations personnalisées pour améliorer votre bien-être.'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos informations personnelles sans votre consentement explicite.'
    },
    {
      question: 'Comment fonctionne l\'essai gratuit ?',
      answer: 'L\'essai gratuit de 3 jours vous donne accès à toutes les fonctionnalités premium d\'EmotionsCare. Aucune carte de crédit n\'est requise pour commencer.'
    },
    {
      question: 'Puis-je utiliser EmotionsCare sur mobile ?',
      answer: 'Oui, EmotionsCare est optimisé pour tous les appareils. Vous pouvez accéder à toutes les fonctionnalités depuis votre smartphone, tablette ou ordinateur.'
    },
    {
      question: 'Comment inviter mes collègues (compte B2B) ?',
      answer: 'Les administrateurs peuvent inviter des collaborateurs depuis la section "Gestion des utilisateurs". Une invitation par email sera envoyée avec les instructions de connexion.'
    }
  ];

  const contactChannels = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Contactez-nous par email',
      value: 'support@emotionscare.fr',
      action: () => window.open('mailto:support@emotionscare.fr')
    },
    {
      icon: MessageCircle,
      title: 'Chat en direct',
      description: 'Discutez avec notre équipe',
      value: 'Disponible 9h-18h',
      action: () => toast.info('Chat en direct bientôt disponible')
    },
    {
      icon: Phone,
      title: 'Téléphone',
      description: 'Appelez notre support',
      value: '+33 1 23 45 67 89',
      action: () => window.open('tel:+33123456789')
    },
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Consultez notre guide',
      value: 'Guide complet',
      action: () => toast.info('Documentation en ligne bientôt disponible')
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.subject || !contactForm.message) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    // Simuler l'envoi du message
    toast.success('Message envoyé ! Nous vous répondrons dans les plus brefs délais.');
    setContactForm({ subject: '', message: '' });
  };

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-6xl">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <HelpCircle className="h-8 w-8" />
            Centre d'aide
          </h1>
          <p className="text-muted-foreground">
            Trouvez des réponses à vos questions ou contactez notre équipe de support
          </p>
        </div>
      </motion.div>

      {/* Recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-base h-12"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquentes</CardTitle>
              <CardDescription>
                Trouvez rapidement des réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredFaq.map((faq, index) => (
                  <div key={index} className="border rounded-lg">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4"
                      >
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Canaux de contact */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Nous contacter</CardTitle>
              <CardDescription>
                Plusieurs moyens de nous joindre
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactChannels.map((channel, index) => {
                const Icon = channel.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={channel.action}
                    className="w-full h-auto p-4 flex flex-col items-start gap-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{channel.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      {channel.description}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {channel.value}
                    </p>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Formulaire de contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Envoyer un message
            </CardTitle>
            <CardDescription>
              Décrivez votre problème ou votre question, nous vous répondrons rapidement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Sujet
                  </label>
                  <Input
                    id="subject"
                    placeholder="Décrivez brièvement votre demande"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Temps de réponse estimé
                  </label>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    Sous 24h en jours ouvrés
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre problème ou votre question en détail..."
                  className="min-h-[120px]"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              
              <Button type="submit" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Informations sur le support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium mb-1">Horaires de support</h3>
                <p className="text-sm text-muted-foreground">
                  Lundi - Vendredi<br />
                  9h00 - 18h00 (CET)
                </p>
              </div>
              <div>
                <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium mb-1">Équipe dédiée</h3>
                <p className="text-sm text-muted-foreground">
                  Experts en bien-être<br />
                  et support technique
                </p>
              </div>
              <div>
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium mb-1">Réponse rapide</h3>
                <p className="text-sm text-muted-foreground">
                  Réponse garantie<br />
                  sous 24h ouvrées
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HelpPage;
