
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, Book, MessageCircle, Phone, Mail, Video, FileText } from 'lucide-react';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const faqItems = [
    {
      category: 'Démarrage',
      items: [
        {
          question: 'Comment commencer avec EmotionsCare ?',
          answer: 'Créez votre compte, suivez le processus d\'onboarding et explorez les différents modules disponibles. Nous recommandons de commencer par un scan émotionnel pour établir votre baseline.'
        },
        {
          question: 'Quelles sont les différentes fonctionnalités disponibles ?',
          answer: 'EmotionsCare propose un scan émotionnel, de la musicothérapie, des expériences VR, un journal personnel, un coach IA, et des outils de gamification pour améliorer votre bien-être.'
        }
      ]
    },
    {
      category: 'Compte et sécurité',
      items: [
        {
          question: 'Comment protéger mon compte ?',
          answer: 'Activez l\'authentification à deux facteurs, utilisez un mot de passe fort, et vérifiez régulièrement les alertes de connexion dans vos paramètres de sécurité.'
        },
        {
          question: 'Mes données sont-elles sécurisées ?',
          answer: 'Oui, toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et vous gardez le contrôle total sur vos informations personnelles.'
        }
      ]
    },
    {
      category: 'Utilisation',
      items: [
        {
          question: 'Comment fonctionne le scan émotionnel ?',
          answer: 'Le scan émotionnel utilise l\'IA pour analyser votre état émotionnel à travers différents indicateurs. Les résultats vous aident à mieux comprendre votre bien-être et recevoir des recommandations personnalisées.'
        },
        {
          question: 'Puis-je utiliser EmotionsCare sur mobile ?',
          answer: 'Oui, EmotionsCare est entièrement responsive et fonctionne parfaitement sur tous les appareils mobiles et tablettes.'
        }
      ]
    }
  ];

  const guides = [
    {
      title: 'Guide de démarrage rapide',
      description: 'Découvrez les bases d\'EmotionsCare en 5 minutes',
      icon: Book,
      duration: '5 min',
      type: 'guide'
    },
    {
      title: 'Optimiser son bien-être au travail',
      description: 'Conseils pour les professionnels de santé',
      icon: Video,
      duration: '15 min',
      type: 'video'
    },
    {
      title: 'Utiliser la musicothérapie',
      description: 'Guide complet des fonctionnalités audio',
      icon: FileText,
      duration: '8 min',
      type: 'guide'
    },
    {
      title: 'Paramètres de confidentialité',
      description: 'Gérer vos données personnelles',
      icon: Book,
      duration: '3 min',
      type: 'guide'
    }
  ];

  const contactOptions = [
    {
      title: 'Chat en direct',
      description: 'Assistance immédiate avec notre équipe',
      icon: MessageCircle,
      available: true,
      responseTime: 'Réponse en moins de 5 min'
    },
    {
      title: 'Support téléphonique',
      description: 'Appelez-nous pour une aide personnalisée',
      icon: Phone,
      available: true,
      responseTime: 'Lun-Ven 9h-18h'
    },
    {
      title: 'Email',
      description: 'Envoyez-nous vos questions détaillées',
      icon: Mail,
      available: true,
      responseTime: 'Réponse sous 24h'
    }
  ];

  const filteredFaq = faqItems.map(category => ({
    ...category,
    items: category.items.filter(item =>
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi
    console.log('Contact form submitted:', contactForm);
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Centre d'aide</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Trouvez les réponses à vos questions ou contactez notre équipe support
          </p>
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="faq" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="status">Statut</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <div className="grid gap-6">
              {filteredFaq.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="outline">{category.category}</Badge>
                      {category.items.length} questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map((item, itemIndex) => (
                        <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
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
              ))}
            </div>

            {filteredFaq.length === 0 && searchQuery && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
                  <p className="text-muted-foreground">
                    Essayez avec d'autres mots-clés ou contactez notre support
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <guide.icon className="h-8 w-8 text-blue-600 mt-1" />
                      <div className="space-y-2">
                        <h3 className="font-semibold">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {guide.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{guide.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {guide.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {contactOptions.map((option, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <option.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {option.description}
                    </p>
                    <p className="text-xs text-green-600 font-medium mb-4">
                      {option.responseTime}
                    </p>
                    <Button 
                      variant={option.available ? "default" : "outline"}
                      disabled={!option.available}
                      className="w-full"
                    >
                      {option.available ? 'Contacter' : 'Bientôt disponible'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Formulaire de contact</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom</label>
                      <Input
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sujet</label>
                    <Input
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statut des services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { service: 'Application principale', status: 'operational', uptime: '99.9%' },
                  { service: 'Scan émotionnel', status: 'operational', uptime: '99.8%' },
                  { service: 'Musicothérapie', status: 'operational', uptime: '99.9%' },
                  { service: 'Expériences VR', status: 'maintenance', uptime: '98.5%' },
                  { service: 'API Coach', status: 'operational', uptime: '99.7%' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'operational' ? 'bg-green-500' :
                        item.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium">{item.service}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        item.status === 'operational' ? 'default' :
                        item.status === 'maintenance' ? 'secondary' : 'destructive'
                      }>
                        {item.status === 'operational' ? 'Opérationnel' :
                         item.status === 'maintenance' ? 'Maintenance' : 'Incident'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{item.uptime}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpCenterPage;
