
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  Book, 
  Video,
  Send,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqItems = [
    {
      id: 'getting-started',
      question: 'Comment commencer avec EmotionsCare ?',
      answer: 'Créez votre compte, choisissez votre mode d\'utilisation (particulier, collaborateur, ou administrateur), puis explorez nos outils d\'analyse émotionnelle. Commencez par une session scanner ou une conversation avec notre coach IA.',
      category: 'Démarrage'
    },
    {
      id: 'data-privacy',
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Absolument. Nous utilisons un chiffrement de niveau bancaire et respectons le RGPD. Vos données personnelles ne sont jamais partagées et vous gardez le contrôle total sur vos informations.',
      category: 'Confidentialité'
    },
    {
      id: 'ai-accuracy',
      question: 'Quelle est la précision de l\'analyse IA ?',
      answer: 'Notre IA utilise des modèles avancés avec une précision de 85-90%. Cependant, elle ne remplace pas un professionnel de santé mentale et doit être considérée comme un outil d\'aide au bien-être.',
      category: 'Technologie'
    },
    {
      id: 'subscription',
      question: 'Comment fonctionne l\'abonnement ?',
      answer: 'Nouveaux utilisateurs bénéficient de 3 jours gratuits. Ensuite, choisissez parmi nos plans flexibles avec paiement mensuel ou annuel. Résiliez à tout moment.',
      category: 'Facturation'
    },
    {
      id: 'coach-ai',
      question: 'Comment utiliser le coach IA efficacement ?',
      answer: 'Soyez honnête et spécifique dans vos questions. Plus vous partagez de détails sur votre situation, plus les conseils seront personnalisés. N\'hésitez pas à poser des questions de suivi.',
      category: 'Coach IA'
    },
    {
      id: 'music-therapy',
      question: 'Comment fonctionne la thérapie musicale ?',
      answer: 'Notre IA génère de la musique adaptée à votre état émotionnel. Décrivez votre humeur ou vos besoins, et la musique sera créée en temps réel pour favoriser relaxation, concentration ou énergie.',
      category: 'Musique'
    },
    {
      id: 'team-features',
      question: 'Quelles sont les fonctionnalités équipe ?',
      answer: 'Les comptes entreprise incluent : analyses anonymisées d\'équipe, tableaux de bord RH, rapports de bien-être collectif, et outils de gestion du stress organisationnel.',
      category: 'Entreprise'
    },
    {
      id: 'technical-issues',
      question: 'Que faire en cas de problème technique ?',
      answer: 'Vérifiez votre connexion internet, actualisez la page, ou essayez un autre navigateur. Si le problème persiste, contactez notre support technique.',
      category: 'Technique'
    }
  ];

  const supportChannels = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: 'Chat en direct',
      description: 'Réponse immédiate pendant les heures d\'ouverture',
      availability: 'Lun-Ven 9h-18h',
      action: 'Démarrer le chat'
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: 'Email',
      description: 'Pour les questions complexes nécessitant du temps',
      availability: 'Réponse sous 24h',
      action: 'support@emotionscare.com'
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: 'Téléphone',
      description: 'Support téléphonique pour les urgences',
      availability: 'Lun-Ven 9h-17h',
      action: '+33 1 23 45 67 89'
    }
  ];

  const resources = [
    {
      icon: <Book className="h-5 w-5" />,
      title: 'Documentation',
      description: 'Guides complets et tutoriels',
      link: '#'
    },
    {
      icon: <Video className="h-5 w-5" />,
      title: 'Vidéos tutoriels',
      description: 'Apprenez visuellement avec nos vidéos',
      link: '#'
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      title: 'Base de connaissances',
      description: 'Articles et réponses détaillées',
      link: '#'
    }
  ];

  const filteredFAQ = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqItems.map(item => item.category))];

  const handleContactSubmit = async () => {
    if (!contactForm.subject || !contactForm.message) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Message envoyé ! Nous vous répondrons rapidement.');
      setContactForm({ subject: '', message: '', priority: 'normal' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      case 'low':
        return <Badge variant="outline">Non urgent</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <HelpCircle className="h-8 w-8 text-blue-600" />
          Centre d'aide
        </h1>
        <p className="text-muted-foreground">
          Trouvez des réponses à vos questions ou contactez notre équipe
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher dans l'aide..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Questions fréquentes</CardTitle>
            <CardDescription>
              {searchTerm && `${filteredFAQ.length} résultat(s) pour "${searchTerm}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFAQ.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-600 mb-2">Aucun résultat</h3>
                <p className="text-sm text-muted-foreground">
                  Essayez avec des termes différents ou contactez notre support
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {filteredFAQ.map((item) => (
                  <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <span>{item.question}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Support Channels */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contactez-nous</CardTitle>
              <CardDescription>
                Choisissez le canal qui vous convient
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {supportChannels.map((channel, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    {channel.icon}
                    <h3 className="font-semibold">{channel.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{channel.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {channel.availability}
                  </div>
                  <Button size="sm" className="w-full">
                    {channel.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Ressources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resources.map((resource, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  asChild
                >
                  <a href={resource.link}>
                    <div className="flex items-center gap-3">
                      {resource.icon}
                      <div className="text-left">
                        <div className="font-medium">{resource.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {resource.description}
                        </div>
                      </div>
                    </div>
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Nous contacter directement</CardTitle>
            <CardDescription>
              Décrivez votre problème et nous vous aiderons rapidement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Sujet de votre demande"
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
              />
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={contactForm.priority}
                onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="low">Non urgent</option>
                <option value="normal">Normal</option>
                <option value="high">Urgent</option>
              </select>
            </div>
            
            <Textarea
              placeholder="Décrivez votre problème en détail..."
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              className="min-h-32"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Temps de réponse estimé: 2-4h
                </span>
              </div>
              <Button 
                onClick={handleContactSubmit} 
                disabled={isSubmitting}
                className="px-6"
              >
                {isSubmitting ? (
                  'Envoi...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Tous les services sont opérationnels
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
