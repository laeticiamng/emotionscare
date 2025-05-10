
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, FileText, Video, HelpCircle, MessageSquare } from 'lucide-react';

// FAQ Data structure
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  popular?: boolean;
}

// Sample FAQ data
const faqData: FAQItem[] = [
  {
    id: '1',
    question: "Comment utiliser l'assistant IA pour gérer mon stress quotidien ?",
    answer: "Notre assistant IA propose plusieurs fonctionnalités pour vous aider à gérer votre stress. Commencez par utiliser la fonction 'Scan' pour évaluer votre niveau de stress actuel. Ensuite, l'assistant vous proposera des exercices de respiration personnalisés, des méditations guidées ou des conseils adaptés à votre situation. Vous pouvez également programmer des rappels quotidiens pour prendre des pauses et utiliser le journal émotionnel pour suivre l'évolution de votre stress dans le temps.",
    category: 'assistant',
    popular: true
  },
  {
    id: '2',
    question: "Comment modifier mes préférences de notifications ?",
    answer: "Pour modifier vos préférences de notifications, accédez à votre profil en cliquant sur votre avatar en haut à droite de l'écran. Sélectionnez 'Paramètres', puis 'Notifications'. Vous pourrez y personnaliser les types de notifications que vous souhaitez recevoir, leur fréquence et les canaux de communication (application, email, SMS). N'oubliez pas de cliquer sur 'Enregistrer' pour appliquer vos modifications.",
    category: 'compte',
  },
  {
    id: '3',
    question: "Comment protéger mes données personnelles sur EmotionsCare ?",
    answer: "EmotionsCare utilise un cryptage AES-256-GCM sur toutes vos données personnelles. Vos informations sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers sans votre consentement explicite. Vous pouvez gérer vos paramètres de confidentialité dans la section 'Paramètres > Confidentialité'. Pour une sécurité optimale, nous vous recommandons d'activer l'authentification à deux facteurs et de consulter régulièrement le rapport d'activité de votre compte.",
    category: 'securite',
    popular: true
  },
  {
    id: '4',
    question: "Comment interpréter les analyses émotionnelles générées ?",
    answer: "Les analyses émotionnelles utilisent un algorithme sophistiqué pour identifier vos tendances émotionnelles. Les graphiques montrent l'évolution de vos émotions principales au fil du temps. Le score d'intensité (de 1 à 10) indique la force de chaque émotion. Les connexions entre émotions révèlent les relations entre vos différents états émotionnels. Pour une interprétation personnalisée, cliquez sur 'Analyse approfondie' pour obtenir des recommandations spécifiques basées sur vos données.",
    category: 'utilisation',
  },
  {
    id: '5',
    question: "Comment synchroniser l'application avec mon bracelet connecté ?",
    answer: "Pour synchroniser votre bracelet connecté, accédez à 'Paramètres > Appareils connectés' et sélectionnez 'Ajouter un appareil'. Assurez-vous que le Bluetooth est activé sur votre téléphone et que votre bracelet est en mode d'appairage. Suivez les instructions à l'écran pour compléter la connexion. Une fois connecté, vous pourrez choisir quelles données partager (rythme cardiaque, qualité de sommeil, etc.) et définir la fréquence de synchronisation. EmotionsCare est compatible avec la plupart des appareils Fitbit, Garmin, Apple Watch et Samsung Galaxy Watch.",
    category: 'technique',
  },
  {
    id: '6',
    question: "Comment accéder aux fonctionnalités premium ?",
    answer: "Pour accéder aux fonctionnalités premium, vous pouvez souscrire à l'un de nos forfaits dans la section 'Abonnement' de votre profil. Nous proposons des options mensuelles ou annuelles avec différents niveaux de service. Les fonctionnalités premium incluent des analyses émotionnelles avancées, un accès prioritaire au support, des sessions personnalisées avec des experts en bien-être, et des contenus exclusifs. Si vous faites partie d'une organisation qui utilise EmotionsCare, contactez votre administrateur pour vérifier si vous avez déjà accès aux fonctionnalités premium via votre licence entreprise.",
    category: 'compte',
    popular: true
  },
];

// Tutorial categories
interface TutorialItem {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'guide';
  duration: number; // in minutes
  url: string;
}

const tutorials: TutorialItem[] = [
  {
    id: 't1',
    title: "Premiers pas avec EmotionsCare",
    description: "Un guide complet pour débuter et configurer votre compte",
    type: 'guide',
    duration: 10,
    url: '#guide-onboarding'
  },
  {
    id: 't2',
    title: "Utiliser l'assistant IA au quotidien",
    description: "Apprenez à tirer le meilleur parti de votre assistant personnel",
    type: 'video',
    duration: 8,
    url: '#video-assistant'
  },
  {
    id: 't3',
    title: "Journal émotionnel : méthodes avancées",
    description: "Techniques efficaces pour suivre et comprendre vos émotions",
    type: 'article',
    duration: 15,
    url: '#article-journal'
  },
  {
    id: 't4',
    title: "Configurer votre espace de méditation virtuel",
    description: "Personnalisez votre expérience de méditation immersive",
    type: 'video',
    duration: 12,
    url: '#video-meditation'
  },
  {
    id: 't5',
    title: "Protection avancée de vos données",
    description: "Comprendre et configurer tous les paramètres de confidentialité",
    type: 'guide',
    duration: 7,
    url: '#guide-privacy'
  },
  {
    id: 't6',
    title: "Interpréter vos analyses émotionnelles",
    description: "Comment comprendre et utiliser les insights générés par l'IA",
    type: 'article',
    duration: 20,
    url: '#article-analysis'
  },
];

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>([]);

  // Filter FAQs by search query and category
  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || category === item.category;
    return matchesSearch && matchesCategory;
  });

  // Popular FAQs
  const popularFAQs = faqData.filter(item => item.popular);

  // Get tutorial icon based on type
  const getTutorialIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'article': return <FileText className="h-5 w-5" />;
      case 'guide': return <BookOpen className="h-5 w-5" />;
      default: return <HelpCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <Card className="premium-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher dans le centre d'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main content tabs */}
      <Tabs defaultValue="faq">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Tutoriels
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Contacter le support
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={category === 'all' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setCategory('all')}
            >
              Tout
            </Button>
            <Button 
              variant={category === 'assistant' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setCategory('assistant')}
            >
              Assistant IA
            </Button>
            <Button 
              variant={category === 'compte' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setCategory('compte')}
            >
              Compte &amp; Abonnement
            </Button>
            <Button 
              variant={category === 'securite' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setCategory('securite')}
            >
              Sécurité &amp; Confidentialité
            </Button>
            <Button 
              variant={category === 'technique' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setCategory('technique')}
            >
              Technique
            </Button>
            <Button 
              variant={category === 'utilisation' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setCategory('utilisation')}
            >
              Utilisation
            </Button>
          </div>

          {/* Popular FAQs section - only show when not searching */}
          {!searchQuery && category === 'all' && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Questions fréquentes</h3>
              <Accordion type="multiple" className="w-full">
                {popularFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="hover:text-primary">
                      {faq.question}
                      <Badge variant="outline" className="ml-2">Populaire</Badge>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* Filter results */}
          <div>
            <h3 className="text-lg font-medium mb-3">
              {searchQuery ? `Résultats pour "${searchQuery}"` : "Toutes les questions"}
            </h3>
            
            {filteredFAQs.length > 0 ? (
              <Accordion type="multiple" className="w-full">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Aucun résultat trouvé pour votre recherche
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setCategory('all');
                }}>
                  Réinitialiser les filtres
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutorials.map((tutorial) => (
              <Card key={tutorial.id} className="premium-card hover-lift">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getTutorialIcon(tutorial.type)}
                    {tutorial.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{tutorial.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {tutorial.type === 'video' ? 'Vidéo' : 
                       tutorial.type === 'article' ? 'Article' : 'Guide'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {tutorial.duration} min
                    </span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    {tutorial.type === 'video' ? 'Regarder' : 
                     tutorial.type === 'article' ? 'Lire' : 'Consulter'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-xl">Contacter notre équipe support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Sujet</label>
                <Input id="subject" placeholder="Sujet de votre demande" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea 
                  id="message" 
                  className="w-full min-h-[150px] p-3 border rounded-md bg-background" 
                  placeholder="Décrivez votre problème ou question en détail"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Priorité</label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Normal</Button>
                  <Button variant="outline" className="flex-1">Urgent</Button>
                  <Button variant="outline" className="flex-1">Critique</Button>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full">
                  Envoyer la demande
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpCenter;
