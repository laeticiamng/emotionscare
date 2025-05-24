
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Book, 
  Video,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: 'Comment fonctionne le scanner d\'émotions ?',
      answer: 'Le scanner d\'émotions utilise l\'intelligence artificielle pour analyser votre voix, vos expressions faciales ou votre texte. L\'IA détecte les patterns émotionnels et vous fournit des insights personnalisés sur votre état émotionnel actuel.',
      category: 'Fonctionnalités'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons strictement le RGPD et ne partageons jamais vos informations personnelles avec des tiers sans votre consentement explicite.',
      category: 'Sécurité'
    },
    {
      question: 'Comment puis-je annuler mon abonnement ?',
      answer: 'Vous pouvez annuler votre abonnement à tout moment depuis la page Paramètres > Abonnement. L\'annulation prend effet à la fin de votre période de facturation actuelle.',
      category: 'Facturation'
    },
    {
      question: 'Le coach IA remplace-t-il un thérapeute ?',
      answer: 'Non, le coach IA est un outil de soutien et ne remplace pas un professionnel de la santé mentale. En cas de détresse sévère, nous recommandons de consulter un psychologue ou psychiatre qualifié.',
      category: 'Fonctionnalités'
    },
    {
      question: 'Comment fonctionne la musicothérapie ?',
      answer: 'Notre système analyse votre état émotionnel et sélectionne automatiquement des musiques adaptées. Les playlists sont créées par des musicothérapeutes professionnels et optimisées par IA selon vos préférences.',
      category: 'Fonctionnalités'
    },
    {
      question: 'Puis-je utiliser EmotionsCare hors ligne ?',
      answer: 'Certaines fonctionnalités comme le journal personnel sont disponibles hors ligne. Cependant, l\'analyse IA et la musicothérapie nécessitent une connexion internet pour fonctionner optimalement.',
      category: 'Technique'
    }
  ];

  const resources = [
    {
      title: 'Guide de démarrage',
      description: 'Découvrez toutes les fonctionnalités pas à pas',
      icon: Book,
      type: 'Guide',
      action: () => toast.info('Guide en cours de préparation')
    },
    {
      title: 'Tutoriels vidéo',
      description: 'Apprenez en vidéo comment utiliser EmotionsCare',
      icon: Video,
      type: 'Vidéo',
      action: () => toast.info('Tutoriels vidéo bientôt disponibles')
    },
    {
      title: 'Communauté',
      description: 'Échangez avec d\'autres utilisateurs',
      icon: MessageCircle,
      type: 'Forum',
      action: () => toast.info('Forum communautaire en développement')
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // Envoyer le message de contact
      toast.success('Message envoyé ! Nous vous répondrons sous 24h.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="mx-auto p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mb-4">
            <HelpCircle className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Centre d'aide</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions et découvrez comment tirer le meilleur parti d'EmotionsCare
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
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 text-lg h-12"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ressources rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Ressources utiles</CardTitle>
            <CardDescription>
              Accédez rapidement aux guides et tutoriels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    onClick={resource.action}
                    className="h-auto flex flex-col items-center gap-3 p-6 w-full"
                  >
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <resource.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {resource.description}
                      </div>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquentes</CardTitle>
              <CardDescription>
                {filteredFaqs.length} question(s) trouvée(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="border rounded-lg">
                  <Button
                    variant="ghost"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full justify-between p-4 h-auto text-left"
                  >
                    <div>
                      <p className="font-medium">{faq.question}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {faq.category}
                      </Badge>
                    </div>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    )}
                  </Button>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Nous contacter</CardTitle>
              <CardDescription>
                Notre équipe est là pour vous aider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <p className="text-xs text-muted-foreground">support@emotionscare.fr</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Clock className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Horaires</p>
                    <p className="text-xs text-muted-foreground">Lun-Ven: 9h-18h</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Envoyer un message</CardTitle>
              <CardDescription>
                Décrivez votre problème ou votre question
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Votre nom *"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Votre email *"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <Input
                  placeholder="Sujet"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                />
                
                <Textarea
                  placeholder="Décrivez votre problème ou question *"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  required
                />
                
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;
