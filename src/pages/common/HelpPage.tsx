
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  Video,
  Search,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    category: 'general'
  });

  const faqItems = [
    {
      question: "Comment commencer à utiliser EmotionsCare ?",
      answer: "Après votre inscription, nous vous recommandons de commencer par l'onboarding qui vous guidera à travers les principales fonctionnalités. Ensuite, vous pouvez faire votre première analyse émotionnelle via le scanner."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Oui, toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos données personnelles sans votre consentement explicite."
    },
    {
      question: "Comment fonctionne l'analyse émotionnelle ?",
      answer: "Notre système utilise l'intelligence artificielle pour analyser vos textes, voix ou expressions faciales et identifier les émotions dominantes. Les résultats sont instantanés et vous aident à mieux comprendre votre état émotionnel."
    },
    {
      question: "Puis-je utiliser l'application hors ligne ?",
      answer: "Certaines fonctionnalités comme la consultation de votre journal sont disponibles hors ligne. Cependant, l'analyse émotionnelle et la génération de musique nécessitent une connexion internet."
    },
    {
      question: "Comment modifier mes paramètres de notification ?",
      answer: "Rendez-vous dans la section Paramètres accessible depuis votre profil. Vous pourrez y personnaliser toutes vos préférences de notification."
    },
    {
      question: "Que faire si j'oublie mon mot de passe ?",
      answer: "Utilisez le lien 'Mot de passe oublié' sur la page de connexion. Vous recevrez un email avec les instructions pour réinitialiser votre mot de passe."
    }
  ];

  const tutorials = [
    {
      title: "Premiers pas avec EmotionsCare",
      duration: "5 min",
      description: "Découvrez les fonctionnalités principales"
    },
    {
      title: "Utiliser le scanner d'émotions",
      duration: "3 min", 
      description: "Guide complet pour analyser vos émotions"
    },
    {
      title: "Créer votre premier journal",
      duration: "4 min",
      description: "Comment tenir un journal émotionnel efficace"
    },
    {
      title: "Générer de la musique thérapeutique",
      duration: "6 min",
      description: "Créez des ambiances sonores personnalisées"
    }
  ];

  const handleContactSubmit = () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    toast.success('Message envoyé ! Nous vous répondrons sous 24h.');
    setContactForm({ subject: '', message: '', category: 'general' });
  };

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Centre d'aide</h1>
          <p className="text-muted-foreground">
            Trouvez des réponses à vos questions et obtenez de l'aide
          </p>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Tutoriels
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Ressources
            </TabsTrigger>
          </TabsList>

          {/* FAQ */}
          <TabsContent value="faq">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Questions fréquentes</CardTitle>
                  <CardDescription>
                    Recherchez parmi nos questions les plus courantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher dans la FAQ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Accordion type="single" collapsible className="space-y-2">
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tutoriels */}
          <TabsContent value="tutorials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      <Badge variant="outline">{tutorial.duration}</Badge>
                    </div>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Video className="h-4 w-4 mr-2" />
                      Regarder le tutoriel
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact */}
          <TabsContent value="contact">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulaire de contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Nous contacter</CardTitle>
                  <CardDescription>
                    Envoyez-nous un message, nous vous répondrons rapidement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sujet</label>
                    <Input
                      placeholder="Décrivez brièvement votre demande"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea
                      placeholder="Décrivez votre problème ou votre question en détail"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={6}
                    />
                  </div>

                  <Button onClick={handleContactSubmit} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer le message
                  </Button>
                </CardContent>
              </Card>

              {/* Moyens de contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Autres moyens de contact</CardTitle>
                  <CardDescription>
                    Choisissez le canal qui vous convient le mieux
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">support@emotionscare.fr</p>
                      <p className="text-xs text-muted-foreground">Réponse sous 24h</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                      <p className="text-xs text-muted-foreground">Lun-Ven 9h-18h</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Chat en direct</p>
                      <p className="text-sm text-muted-foreground">Assistance instantanée</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Démarrer le chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ressources */}
          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Guide complet d'utilisation de la plateforme
                  </p>
                  <Button variant="outline" className="w-full">
                    Consulter la doc
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Webinaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sessions de formation en ligne
                  </p>
                  <Button variant="outline" className="w-full">
                    Voir les sessions
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Communauté
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Échangez avec d'autres utilisateurs
                  </p>
                  <Button variant="outline" className="w-full">
                    Rejoindre le forum
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpPage;
