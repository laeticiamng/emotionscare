
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Mail, 
  Phone, 
  Book,
  Video,
  FileText,
  Send,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Votre message a été envoyé. Nous vous répondrons dans les plus brefs délais.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const faqItems = [
    {
      question: "Comment commencer à utiliser EmotionsCare ?",
      answer: "Après votre inscription, suivez le processus d'onboarding qui vous guidera dans la configuration de votre profil et la définition de vos objectifs de bien-être. Vous pourrez ensuite accéder à toutes les fonctionnalités depuis votre tableau de bord."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Oui, nous prenons la sécurité très au sérieux. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos informations personnelles avec des tiers sans votre consentement explicite."
    },
    {
      question: "Comment fonctionne l'analyse émotionnelle ?",
      answer: "Notre IA utilise des technologies avancées de traitement du langage naturel et d'analyse vocale pour comprendre vos émotions à partir de vos textes, voix ou choix d'émojis. L'analyse est instantanée et vous donne un aperçu de votre état émotionnel actuel."
    },
    {
      question: "Puis-je utiliser EmotionsCare hors ligne ?",
      answer: "Certaines fonctionnalités de base sont disponibles hors ligne, comme la rédaction dans votre journal personnel. Cependant, l'analyse IA et la synchronisation nécessitent une connexion internet."
    },
    {
      question: "Comment annuler mon abonnement ?",
      answer: "Vous pouvez annuler votre abonnement à tout moment depuis les paramètres de votre compte. Votre accès restera actif jusqu'à la fin de votre période de facturation actuelle."
    },
    {
      question: "Que faire si je rencontre un problème technique ?",
      answer: "Contactez notre support technique via le formulaire ci-dessous ou par email. Décrivez le problème en détail et nous vous aiderons rapidement à le résoudre."
    }
  ];

  const quickLinks = [
    {
      title: "Guide de démarrage",
      description: "Apprenez les bases d'EmotionsCare",
      icon: <Book className="h-6 w-6" />,
      action: () => console.log('Guide')
    },
    {
      title: "Tutoriels vidéo",
      description: "Regardez nos guides en vidéo",
      icon: <Video className="h-6 w-6" />,
      action: () => console.log('Vidéos')
    },
    {
      title: "Documentation API",
      description: "Pour les développeurs",
      icon: <FileText className="h-6 w-6" />,
      action: () => console.log('API')
    },
    {
      title: "Statut des services",
      description: "Vérifiez l'état de nos services",
      icon: <ExternalLink className="h-6 w-6" />,
      action: () => console.log('Statut')
    }
  ];

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Centre d'aide</h1>
          <p className="text-muted-foreground mt-2">
            Trouvez des réponses à vos questions ou contactez notre équipe
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans l'aide..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Liens rapides</CardTitle>
            <CardDescription>
              Accédez rapidement aux ressources les plus utiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={link.action}
                  className="h-auto flex flex-col items-center gap-3 p-6"
                >
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    {link.icon}
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{link.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {link.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>Questions fréquentes</span>
              </CardTitle>
              <CardDescription>
                {filteredFAQ.length} question{filteredFAQ.length > 1 ? 's' : ''} trouvée{filteredFAQ.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {filteredFAQ.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              {filteredFAQ.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aucune question trouvée pour "{searchTerm}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Nous contacter</span>
              </CardTitle>
              <CardDescription>
                Vous ne trouvez pas votre réponse ? Envoyez-nous un message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Sujet</label>
                  <Input
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="De quoi voulez-vous parler ?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Décrivez votre question ou problème..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Autres moyens de contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">support@emotionscare.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                  <p className="text-xs text-muted-foreground">Lun-Ven 9h-18h</p>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Temps de réponse moyen : <strong>2-4 heures</strong> en jours ouvrés
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;
