
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Book, 
  Video,
  Mail,
  Phone,
  Send,
  ExternalLink,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const faqItems = [
    {
      question: "Comment fonctionne l'analyse émotionnelle ?",
      answer: "Notre système d'intelligence artificielle analyse vos textes, enregistrements vocaux ou sélections d'émojis pour évaluer votre état émotionnel. L'algorithme prend en compte plusieurs facteurs comme le choix des mots, le ton de la voix, et les patterns émotionnels pour vous fournir un score de bien-être précis."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Oui, absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos informations personnelles sans votre consentement explicite. Vous pouvez consulter notre politique de confidentialité pour plus de détails."
    },
    {
      question: "Comment rejoindre la communauté ?",
      answer: "La communauté est accessible directement depuis votre tableau de bord. Vous pouvez partager vos expériences, poser des questions et soutenir d'autres membres. Vous avez le contrôle total sur votre niveau de participation et pouvez choisir de rester anonyme."
    },
    {
      question: "Que faire si mon score émotionnel est bas ?",
      answer: "Un score bas n'est pas alarmant - c'est une information utile. L'application vous proposera des recommandations personnalisées comme des exercices de respiration, de la méditation guidée, ou des ressources de bien-être. N'hésitez pas à consulter un professionnel si vous ressentez le besoin d'un accompagnement."
    },
    {
      question: "Comment fonctionne le mode B2B ?",
      answer: "Le mode B2B permet aux entreprises de suivre le bien-être de leurs équipes tout en respectant l'anonymat. Les administrateurs ont accès à des statistiques globales et peuvent identifier les départements nécessitant plus d'attention, sans voir les données individuelles."
    },
    {
      question: "Puis-je utiliser l'application hors ligne ?",
      answer: "Certaines fonctionnalités sont disponibles hors ligne, comme la consultation de votre historique et les exercices de bien-être téléchargés. Cependant, l'analyse émotionnelle nécessite une connexion internet pour fonctionner."
    }
  ];

  const tutorials = [
    {
      title: "Première analyse émotionnelle",
      description: "Découvrez comment effectuer votre première analyse",
      duration: "3 min",
      level: "Débutant",
      type: "video"
    },
    {
      title: "Naviguer dans la communauté",
      description: "Apprenez à interagir avec les autres membres",
      duration: "5 min",
      level: "Débutant",
      type: "guide"
    },
    {
      title: "Interpréter vos résultats",
      description: "Comprenez vos scores et recommandations",
      duration: "4 min",
      level: "Intermédiaire",
      type: "video"
    },
    {
      title: "Paramètres de confidentialité",
      description: "Configurez vos préférences de vie privée",
      duration: "6 min",
      level: "Avancé",
      type: "guide"
    }
  ];

  const resources = [
    {
      title: "Guide de l'utilisateur",
      description: "Documentation complète de l'application",
      type: "PDF",
      url: "#"
    },
    {
      title: "API Documentation",
      description: "Pour les développeurs et intégrations",
      type: "Web",
      url: "#"
    },
    {
      title: "Ressources de bien-être",
      description: "Articles et conseils d'experts",
      type: "Blog",
      url: "#"
    },
    {
      title: "Webinaires",
      description: "Sessions en direct avec nos experts",
      type: "Video",
      url: "#"
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Simulate sending message
    toast.success("Message envoyé avec succès ! Nous vous répondrons sous 24h.");
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };

  const filteredFAQ = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center">
          <HelpCircle className="mr-3 h-10 w-10 text-primary" />
          Centre d'Aide
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Trouvez des réponses à vos questions et apprenez à tirer le meilleur parti d'EmotionsCare
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'aide..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutoriels</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Questions Fréquentes
              </CardTitle>
              <CardDescription>
                Trouvez rapidement des réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQ.map((item, index) => (
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
              
              {filteredFAQ.length === 0 && searchTerm && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Aucune question trouvée pour "{searchTerm}"
                  </p>
                  <Button variant="outline" className="mt-4">
                    Poser une nouvelle question
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tutorials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="mr-2 h-5 w-5" />
                Tutoriels et Guides
              </CardTitle>
              <CardDescription>
                Apprenez à utiliser toutes les fonctionnalités d'EmotionsCare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorials.map((tutorial, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {tutorial.type === 'video' ? (
                            <Video className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Book className="h-5 w-5 text-green-600" />
                          )}
                          <Badge variant="secondary">{tutorial.level}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{tutorial.duration}</span>
                      </div>
                      <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{tutorial.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Voir le tutoriel
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Ressources et Documentation
              </CardTitle>
              <CardDescription>
                Accédez à toute la documentation et aux ressources utiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{resource.type}</Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Nous Contacter
                </CardTitle>
                <CardDescription>
                  Envoyez-nous un message, nous vous répondrons rapidement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nom *</label>
                      <Input
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email *</label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Catégorie</label>
                    <select
                      value={contactForm.category}
                      onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="general">Question générale</option>
                      <option value="technical">Problème technique</option>
                      <option value="billing">Facturation</option>
                      <option value="feature">Demande de fonctionnalité</option>
                      <option value="bug">Rapport de bug</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sujet</label>
                    <Input
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      placeholder="Résumé de votre demande"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message *</label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Décrivez votre question ou problème en détail..."
                      className="min-h-32"
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

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Autres Moyens de Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">support@emotionscare.fr</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Chat en direct</p>
                      <p className="text-sm text-muted-foreground">Lun-Ven 9h-18h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Temps de Réponse</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Questions générales</span>
                    <Badge variant="secondary">< 24h</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Problèmes techniques</span>
                    <Badge variant="secondary">< 12h</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Urgences</span>
                    <Badge variant="default">< 4h</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-500" />
                    Satisfaction Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">4.8/5</div>
                    <p className="text-sm text-muted-foreground">
                      Basé sur 1,247 avis clients
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpPage;
