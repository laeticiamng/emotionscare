
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  BookOpen, 
  Video,
  FileText,
  ExternalLink,
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

  const faqs = [
    {
      category: 'Général',
      questions: [
        {
          question: 'Comment fonctionne le scanner émotionnel ?',
          answer: 'Le scanner émotionnel utilise l\'intelligence artificielle pour analyser vos émotions à partir de votre voix, de vos expressions faciales ou de votre texte. Il fournit des insights personnalisés sur votre état émotionnel.'
        },
        {
          question: 'Mes données sont-elles sécurisées ?',
          answer: 'Oui, toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos informations personnelles sans votre consentement explicite.'
        },
        {
          question: 'Puis-je utiliser EmotionsCare hors ligne ?',
          answer: 'Certaines fonctionnalités comme le journal personnel fonctionnent hors ligne. Cependant, les analyses IA et la synchronisation nécessitent une connexion internet.'
        }
      ]
    },
    {
      category: 'Compte et Facturation',
      questions: [
        {
          question: 'Comment modifier mon abonnement ?',
          answer: 'Vous pouvez modifier votre abonnement dans les paramètres de votre compte. Les changements prennent effet immédiatement ou au prochain cycle de facturation.'
        },
        {
          question: 'Puis-je annuler mon abonnement à tout moment ?',
          answer: 'Oui, vous pouvez annuler votre abonnement à tout moment. Vous continuerez à avoir accès aux fonctionnalités premium jusqu\'à la fin de votre période de facturation.'
        },
        {
          question: 'Y a-t-il un remboursement disponible ?',
          answer: 'Nous offrons un remboursement de 30 jours pour tous nos plans premium. Contactez notre support pour initier une demande de remboursement.'
        }
      ]
    },
    {
      category: 'Fonctionnalités',
      questions: [
        {
          question: 'Comment utiliser le coach IA ?',
          answer: 'Le coach IA est accessible depuis votre tableau de bord. Décrivez votre situation ou vos émotions, et il vous fournira des conseils personnalisés et des exercices adaptés.'
        },
        {
          question: 'Comment fonctionne la musique thérapie ?',
          answer: 'La musique thérapie génère des compositions personnalisées basées sur votre état émotionnel actuel. Vous pouvez également choisir des genres et des ambiances spécifiques.'
        },
        {
          question: 'Puis-je partager mon journal avec mon thérapeute ?',
          answer: 'Oui, vous pouvez exporter vos entrées de journal au format PDF pour les partager avec votre thérapeute ou professionnel de santé.'
        }
      ]
    }
  ];

  const resources = [
    {
      title: 'Guide de démarrage rapide',
      description: 'Découvrez les fonctionnalités principales en 5 minutes',
      type: 'video',
      icon: Video,
      time: '5 min'
    },
    {
      title: 'Documentation complète',
      description: 'Manuel utilisateur détaillé avec captures d\'écran',
      type: 'document',
      icon: FileText,
      time: '30 min'
    },
    {
      title: 'Tutoriels vidéo',
      description: 'Série de vidéos pour maîtriser toutes les fonctionnalités',
      type: 'video',
      icon: Video,
      time: '2h'
    },
    {
      title: 'Blog et articles',
      description: 'Conseils bien-être et mises à jour produit',
      type: 'external',
      icon: ExternalLink,
      time: 'Variable'
    }
  ];

  const supportTickets = [
    {
      id: '#2024-001',
      subject: 'Problème de synchronisation',
      status: 'resolved',
      priority: 'normal',
      created: '2024-01-15',
      updated: '2024-01-16'
    },
    {
      id: '#2024-002',
      subject: 'Question sur la facturation',
      status: 'pending',
      priority: 'low',
      created: '2024-01-18',
      updated: '2024-01-18'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Recherche pour: "${searchTerm}"`);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message envoyé ! Nous vous répondrons sous 24h.');
    setContactForm({ subject: '', message: '', priority: 'normal' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Résolu</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">En attente</Badge>;
      case 'urgent':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Urgent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Centre d'aide</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Trouvez rapidement les réponses à vos questions ou contactez notre équipe support
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Rechercher</Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Chat en direct</CardTitle>
            <CardDescription>
              Support instantané avec notre équipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Démarrer une conversation
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Disponible 9h-18h (lun-ven)
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Email support</CardTitle>
            <CardDescription>
              Envoyez-nous un message détaillé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Envoyer un email
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Réponse sous 24h maximum
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Support téléphonique</CardTitle>
            <CardDescription>
              Appelez-nous pour une aide urgente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              +33 1 23 45 67 89
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Lun-Ven 9h-18h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="tickets">Mes tickets</TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Questions fréquentes
              </CardTitle>
              <CardDescription>
                Trouvez rapidement les réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length > 0 ? (
                <div className="space-y-6">
                  {filteredFaqs.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h3 className="text-lg font-semibold mb-3">{category.category}</h3>
                      <Accordion type="single" collapsible>
                        {category.questions.map((faq, faqIndex) => (
                          <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-muted-foreground">{faq.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Aucune question trouvée pour "{searchTerm}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Ressources et guides
              </CardTitle>
              <CardDescription>
                Documentation, tutoriels et guides pour vous aider à maîtriser EmotionsCare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <resource.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{resource.title}</CardTitle>
                          <CardDescription>{resource.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{resource.time}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Accéder
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contactez-nous
              </CardTitle>
              <CardDescription>
                Envoyez-nous un message et nous vous répondrons rapidement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sujet</label>
                  <Input
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Décrivez brièvement votre problème"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priorité</label>
                  <div className="flex gap-2">
                    {['low', 'normal', 'high', 'urgent'].map((priority) => (
                      <Button
                        key={priority}
                        type="button"
                        variant={contactForm.priority === priority ? "default" : "outline"}
                        size="sm"
                        onClick={() => setContactForm(prev => ({ ...prev, priority }))}
                      >
                        {priority === 'low' && 'Faible'}
                        {priority === 'normal' && 'Normale'}
                        {priority === 'high' && 'Élevée'}
                        {priority === 'urgent' && 'Urgente'}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Décrivez votre problème en détail..."
                    rows={6}
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

        {/* Support Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Mes tickets de support
              </CardTitle>
              <CardDescription>
                Suivez l'état de vos demandes de support
              </CardDescription>
            </CardHeader>
            <CardContent>
              {supportTickets.length > 0 ? (
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(ticket.status)}
                        <div>
                          <div className="font-medium">{ticket.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {ticket.id} • Créé le {ticket.created}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ticket.status)}
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Aucun ticket de support</p>
                  <p className="text-sm text-muted-foreground">
                    Vos demandes de support apparaîtront ici
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpPage;
