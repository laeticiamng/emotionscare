
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Book,
  Video,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const SupportPage: React.FC = () => {
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: "Comment commencer avec EmotionsCare ?",
      answer: "Après votre inscription, nous vous recommandons de commencer par un scan émotionnel pour établir votre profil de base. Ensuite, explorez les différentes fonctionnalités comme le journal, la musicothérapie et les sessions VR selon vos besoins."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de niveau militaire pour protéger vos données. Toutes les informations personnelles sont anonymisées et nous respectons strictement le RGPD. Vous avez un contrôle total sur vos données."
    },
    {
      question: "Comment fonctionne le coach IA ?",
      answer: "Notre coach IA analyse vos données émotionnelles, vos activités et vos préférences pour vous proposer des recommandations personnalisées. Il apprend de vos interactions pour s'améliorer continuellement."
    },
    {
      question: "Puis-je utiliser EmotionsCare sans casque VR ?",
      answer: "Oui ! La réalité virtuelle est une fonctionnalité optionnelle. Vous pouvez profiter pleinement d'EmotionsCare avec le journal, la musicothérapie, le coach IA et toutes les autres fonctionnalités."
    },
    {
      question: "Comment annuler mon abonnement ?",
      answer: "Vous pouvez annuler votre abonnement à tout moment depuis vos paramètres de compte. L'annulation prend effet à la fin de votre période de facturation actuelle."
    },
    {
      question: "L'application fonctionne-t-elle hors ligne ?",
      answer: "Certaines fonctionnalités comme le journal et la consultation de vos données fonctionnent hors ligne. Cependant, le coach IA et les sessions VR nécessitent une connexion internet."
    }
  ];

  const tutorials = [
    {
      title: "Premiers pas avec EmotionsCare",
      duration: "5 min",
      type: "video",
      description: "Découvrez les fonctionnalités principales"
    },
    {
      title: "Utiliser le scanner émotionnel",
      duration: "3 min",
      type: "guide",
      description: "Guide complet du scan émotionnel"
    },
    {
      title: "Maximiser votre bien-être avec la VR",
      duration: "7 min",
      type: "video",
      description: "Techniques avancées de relaxation VR"
    },
    {
      title: "Interpréter vos statistiques",
      duration: "4 min",
      type: "guide",
      description: "Comprendre vos données de bien-être"
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Votre demande a été envoyée. Nous vous répondrons sous 24h.');
    setTicketForm({ subject: '', category: '', priority: 'medium', description: '' });
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Centre d'aide</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions ou contactez notre équipe support
          </p>
        </div>

        {/* Contact rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2">Chat en direct</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Réponse immédiate
              </p>
              <Button size="sm" className="w-full">Commencer le chat</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Réponse sous 24h
              </p>
              <Button size="sm" variant="outline" className="w-full">
                support@emotionscare.com
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 mx-auto mb-3 text-purple-500" />
              <h3 className="font-semibold mb-2">Téléphone</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Lun-Ven 9h-18h
              </p>
              <Button size="sm" variant="outline" className="w-full">
                +33 1 23 45 67 89
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides & Tutoriels</TabsTrigger>
            <TabsTrigger value="contact">Nous contacter</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            {/* Barre de recherche */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher dans la FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Questions fréquemment posées</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guides et Tutoriels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tutorials.map((tutorial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        {tutorial.type === 'video' ? (
                          <Video className="h-6 w-6 text-red-500 mt-1" />
                        ) : (
                          <Book className="h-6 w-6 text-blue-500 mt-1" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{tutorial.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {tutorial.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              {tutorial.duration}
                            </Badge>
                            <Badge variant="outline">{tutorial.type}</Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulaire de contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Créer un ticket de support</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                        placeholder="Décrivez brièvement votre problème"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <select
                          id="category"
                          value={ticketForm.category}
                          onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="">Sélectionner...</option>
                          <option value="technical">Problème technique</option>
                          <option value="billing">Facturation</option>
                          <option value="account">Compte utilisateur</option>
                          <option value="feature">Demande de fonctionnalité</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priorité</Label>
                        <select
                          id="priority"
                          value={ticketForm.priority}
                          onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="low">Faible</option>
                          <option value="medium">Moyenne</option>
                          <option value="high">Élevée</option>
                          <option value="urgent">Urgente</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description détaillée</Label>
                      <Textarea
                        id="description"
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                        placeholder="Décrivez votre problème en détail..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Envoyer la demande
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Informations de contact */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Horaires du support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Lundi - Vendredi: 9h00 - 18h00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Samedi: 10h00 - 16h00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Dimanche: Fermé</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Temps de réponse</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Chat en direct</span>
                      <Badge variant="secondary">Immédiat</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email</span>
                      <Badge variant="outline">24h</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ticket urgent</span>
                      <Badge variant="destructive">2h</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default SupportPage;
