
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  Video, 
  Mail, 
  Phone, 
  Clock,
  Search,
  Book,
  Users,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const faqItems = [
    {
      id: 'account',
      question: 'Comment créer mon compte EmotionsCare ?',
      answer: 'Pour créer votre compte, cliquez sur "Créer un compte" depuis la page d\'accueil, choisissez votre espace (Personnel ou Entreprise), puis remplissez le formulaire d\'inscription avec vos informations.'
    },
    {
      id: 'scan',
      question: 'Comment fonctionne le scan émotionnel ?',
      answer: 'Le scan émotionnel utilise l\'IA pour analyser vos réponses à un questionnaire rapide et déterminer votre état émotionnel actuel. Il vous propose ensuite des recommandations personnalisées.'
    },
    {
      id: 'music',
      question: 'Puis-je utiliser la musicothérapie sans casque ?',
      answer: 'Oui, la musicothérapie fonctionne avec vos haut-parleurs, mais nous recommandons l\'utilisation d\'un casque pour une expérience optimale et immersive.'
    },
    {
      id: 'coach',
      question: 'Le coach IA est-il disponible 24h/24 ?',
      answer: 'Oui, votre coach IA personnel est disponible à tout moment. Il s\'adapte à votre emploi du temps et à vos besoins émotionnels en temps réel.'
    },
    {
      id: 'data',
      question: 'Mes données personnelles sont-elles sécurisées ?',
      answer: 'Absolument. Nous utilisons un chiffrement de niveau bancaire et respectons strictement le RGPD. Vos données ne sont jamais partagées avec des tiers sans votre consentement explicite.'
    },
    {
      id: 'subscription',
      question: 'Comment fonctionne l\'abonnement ?',
      answer: 'EmotionsCare propose différents plans selon vos besoins. Vous pouvez commencer avec un essai gratuit, puis choisir l\'abonnement qui vous convient le mieux.'
    }
  ];

  const guides = [
    {
      title: 'Guide de démarrage rapide',
      description: 'Apprenez les bases d\'EmotionsCare en 5 minutes',
      duration: '5 min',
      type: 'Débutant',
      icon: Book
    },
    {
      title: 'Optimiser son scan émotionnel',
      description: 'Conseils pour des résultats plus précis',
      duration: '8 min',
      type: 'Intermédiaire',
      icon: Lightbulb
    },
    {
      title: 'Utilisation avancée du coach IA',
      description: 'Tirez le maximum de votre coach personnel',
      duration: '12 min',
      type: 'Avancé',
      icon: Users
    }
  ];

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supportForm.name || !supportForm.email || !supportForm.message) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Simulation d'envoi
    toast.success('Votre demande a été envoyée ! Nous vous répondrons sous 24h.');
    setSupportForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Centre d'aide
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Trouvez rapidement les réponses à vos questions ou contactez notre équipe support
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Input
              type="text"
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <Tabs defaultValue="faq" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="status">Statut</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Questions fréquentes
                </CardTitle>
                <CardDescription>
                  Trouvez rapidement les réponses aux questions les plus courantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFAQ.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFAQ.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Aucun résultat trouvé pour "{searchQuery}"
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery('')}
                      className="mt-4"
                    >
                      Effacer la recherche
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide, index) => {
                const IconComponent = guide.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                        <Badge variant="outline">{guide.type}</Badge>
                      </div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {guide.duration}
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <Video className="h-4 w-4 mr-2" />
                        Voir le guide
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Contacter le support
                  </CardTitle>
                  <CardDescription>
                    Décrivez votre problème et nous vous répondrons rapidement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom *</Label>
                        <Input
                          id="name"
                          value={supportForm.name}
                          onChange={(e) => setSupportForm({...supportForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={supportForm.email}
                          onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <select
                        id="category"
                        value={supportForm.category}
                        onChange={(e) => setSupportForm({...supportForm, category: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="general">Question générale</option>
                        <option value="technical">Problème technique</option>
                        <option value="billing">Facturation</option>
                        <option value="feature">Demande de fonctionnalité</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        value={supportForm.subject}
                        onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={supportForm.message}
                        onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                        placeholder="Décrivez votre problème en détail..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Envoyer la demande
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Options */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Autres moyens de contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600">support@emotionscare.com</p>
                        <p className="text-xs text-gray-500">Réponse sous 24h</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Téléphone</p>
                        <p className="text-sm text-gray-600">+33 1 23 45 67 89</p>
                        <p className="text-xs text-gray-500">Lun-Ven 9h-18h</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Chat en direct</p>
                        <p className="text-sm text-gray-600">Disponible dans l'app</p>
                        <p className="text-xs text-gray-500">Réponse immédiate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ressources utiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Documentation API
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Video className="h-4 w-4 mr-2" />
                        Tutoriels vidéo
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Communauté
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                  Statut des services
                </CardTitle>
                <CardDescription>
                  État en temps réel de nos services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Application web', status: 'operational', uptime: '99.9%' },
                    { name: 'API Coach IA', status: 'operational', uptime: '99.8%' },
                    { name: 'Scan émotionnel', status: 'operational', uptime: '99.9%' },
                    { name: 'Musicothérapie', status: 'operational', uptime: '100%' },
                    { name: 'Base de données', status: 'operational', uptime: '99.9%' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-3 ${
                          service.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-green-700 border-green-200">
                          Opérationnel
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Maintenance programmée</h4>
                  <p className="text-sm text-blue-700">
                    Aucune maintenance prévue dans les 7 prochains jours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpCenterPage;
