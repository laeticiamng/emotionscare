
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
  BookOpen,
  Video,
  FileText,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    email: ''
  });

  const faqItems = [
    {
      question: "Comment fonctionne l'analyse émotionnelle IA ?",
      answer: "Notre IA analyse votre texte ou voix en utilisant des modèles avancés de traitement du langage naturel. Elle identifie les émotions, évalue le stress et fournit des recommandations personnalisées basées sur votre état émotionnel."
    },
    {
      question: "Mes données personnelles sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de bout en bout et suivons les normes RGPD. Vos données émotionnelles ne sont jamais partagées sans votre consentement explicite et sont stockées de manière sécurisée."
    },
    {
      question: "Comment puis-je inviter des collaborateurs (B2B) ?",
      answer: "En tant qu'administrateur, vous pouvez inviter des utilisateurs depuis votre tableau de bord. Allez dans 'Gestion des utilisateurs' et cliquez sur 'Inviter un utilisateur'. Un email d'invitation sera envoyé automatiquement."
    },
    {
      question: "Que faire si l'analyse ne reflète pas mon état ?",
      answer: "L'IA s'améliore avec le temps. Si une analyse semble incorrecte, vous pouvez nous le signaler. Plus vous utilisez l'application, plus les recommandations deviennent précises et personnalisées."
    },
    {
      question: "Comment fonctionne la musicothérapie IA ?",
      answer: "Notre système génère de la musique personnalisée basée sur votre état émotionnel et vos préférences. Vous pouvez également décrire l'ambiance souhaitée pour que l'IA compose une mélodie adaptée."
    },
    {
      question: "Puis-je utiliser EmotionsCare hors ligne ?",
      answer: "Certaines fonctionnalités de base sont disponibles hors ligne, mais l'analyse IA et la synchronisation nécessitent une connexion internet pour fonctionner optimalement."
    }
  ];

  const tutorials = [
    {
      title: "Premiers pas avec EmotionsCare",
      description: "Guide complet pour configurer votre profil",
      type: "video",
      duration: "5 min"
    },
    {
      title: "Comprendre vos analyses émotionnelles",
      description: "Interpréter les résultats et recommandations",
      type: "article",
      duration: "3 min"
    },
    {
      title: "Utiliser le coach IA efficacement",
      description: "Maximiser vos conversations avec l'assistant",
      type: "guide",
      duration: "7 min"
    },
    {
      title: "Configuration B2B pour administrateurs",
      description: "Paramétrer EmotionsCare pour votre organisation",
      type: "video",
      duration: "10 min"
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.subject || !contactForm.message) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    toast.success('Message envoyé ! Nous vous répondrons sous 24h');
    setContactForm({ subject: '', message: '', email: '' });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'guide': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'article': return 'bg-green-100 text-green-800';
      case 'guide': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
          <HelpCircle className="h-10 w-10 text-primary" />
          Centre d'Aide
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Trouvez des réponses à vos questions ou contactez notre équipe support
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher dans la documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Questions Fréquentes</CardTitle>
              <CardDescription>
                Réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFaq.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaq.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aucun résultat trouvé pour "{searchQuery}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tutorials */}
          <Card>
            <CardHeader>
              <CardTitle>Guides et Tutoriels</CardTitle>
              <CardDescription>
                Apprenez à utiliser EmotionsCare efficacement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tutorials.map((tutorial, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => toast.info('Contenu en développement')}
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {getTypeIcon(tutorial.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{tutorial.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {tutorial.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(tutorial.type)}>
                        {tutorial.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {tutorial.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nous Contacter</CardTitle>
              <CardDescription>
                Notre équipe est là pour vous aider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat en direct
                  <Badge className="ml-auto bg-green-100 text-green-800">
                    En ligne
                  </Badge>
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  support@emotionscare.com
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  +33 1 23 45 67 89
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center pt-2">
                <p>Lun-Ven: 9h-18h</p>
                <p>Temps de réponse moyen: 2h</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Envoyer un Message</CardTitle>
              <CardDescription>
                Décrivez votre problème en détail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sujet *</label>
                  <Input
                    placeholder="Résumé de votre question"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email de contact</label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message *</label>
                  <Textarea
                    placeholder="Décrivez votre problème ou question..."
                    className="min-h-[100px]"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
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

          <Card>
            <CardHeader>
              <CardTitle>Ressources Utiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Documentation API
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Notes de version
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <Video className="mr-2 h-4 w-4" />
                Webinaires
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
