
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

  const faqData = [
    {
      category: 'Général',
      questions: [
        {
          question: 'Comment fonctionne l\'analyse émotionnelle ?',
          answer: 'Notre IA analyse votre langage naturel, vos expressions faciales (si activé) et vos patterns comportementaux pour identifier vos états émotionnels. L\'analyse est basée sur des modèles scientifiques validés en psychologie cognitive.'
        },
        {
          question: 'Mes données sont-elles sécurisées ?',
          answer: 'Absolument. Toutes vos données sont chiffrées end-to-end et stockées selon les normes RGPD. Nous ne partageons jamais vos informations personnelles avec des tiers sans votre consentement explicite.'
        },
        {
          question: 'Puis-je utiliser EmotionsCare hors ligne ?',
          answer: 'Certaines fonctionnalités sont disponibles hors ligne, comme la saisie de journal émotionnel. Cependant, l\'analyse IA et la synchronisation nécessitent une connexion internet.'
        }
      ]
    },
    {
      category: 'Fonctionnalités',
      questions: [
        {
          question: 'Comment interpréter mon score émotionnel ?',
          answer: 'Le score de 0 à 100 reflète votre bien-être global : 0-30 (difficile), 31-60 (moyen), 61-80 (bon), 81-100 (excellent). Ce score évolue selon vos interactions et votre progression.'
        },
        {
          question: 'Comment fonctionne le coach IA ?',
          answer: 'Le coach IA utilise des techniques de thérapie cognitive comportementale (TCC) et de psychologie positive. Il s\'adapte à votre profil et vos besoins spécifiques pour vous proposer des exercices et conseils personnalisés.'
        },
        {
          question: 'La musicothérapie est-elle vraiment efficace ?',
          answer: 'Oui ! La musicothérapie est scientifiquement prouvée pour réduire le stress, améliorer l\'humeur et favoriser la relaxation. Notre IA génère des compositions adaptées à votre état émotionnel actuel.'
        }
      ]
    },
    {
      category: 'Compte et Facturation',
      questions: [
        {
          question: 'Comment fonctionne la période d\'essai ?',
          answer: '3 jours gratuits avec accès complet à toutes les fonctionnalités. Aucune carte bancaire requise. Vous pouvez annuler à tout moment pendant la période d\'essai.'
        },
        {
          question: 'Puis-je changer de formule ?',
          answer: 'Oui, vous pouvez upgrader ou downgrader votre abonnement à tout moment depuis vos paramètres de compte. Les changements prennent effet immédiatement.'
        },
        {
          question: 'Comment annuler mon abonnement ?',
          answer: 'Vous pouvez annuler votre abonnement depuis les paramètres de votre compte. Vous conservez l\'accès jusqu\'à la fin de votre période de facturation actuelle.'
        }
      ]
    }
  ];

  const quickLinks = [
    { title: 'Guide de démarrage', icon: Book, description: 'Premiers pas avec EmotionsCare' },
    { title: 'Tutoriels vidéo', icon: Video, description: 'Apprenez en regardant' },
    { title: 'Documentation API', icon: FileText, description: 'Pour les développeurs' },
    { title: 'Centre de ressources', icon: HelpCircle, description: 'Articles et guides' }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi du message
    toast.success('Votre message a été envoyé ! Nous vous répondrons sous 24h.');
    setContactForm({ subject: '', message: '', email: '' });
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Centre d'Aide</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Trouvez des réponses à vos questions ou contactez notre équipe
        </p>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liens rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <link.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">{link.title}</h3>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Questions Fréquentes</CardTitle>
              <CardDescription>
                Les réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFAQ.length > 0 ? (
                <div className="space-y-6">
                  {filteredFAQ.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">{category.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {category.questions.length} question{category.questions.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <Accordion type="single" collapsible>
                        {category.questions.map((faq, index) => (
                          <AccordionItem key={index} value={`${categoryIndex}-${index}`}>
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
                  <p className="text-muted-foreground">
                    Aucun résultat trouvé pour "{searchQuery}"
                  </p>
                </div>
              )}
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
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Chat en direct</p>
                    <p className="text-sm text-muted-foreground">Lun-Ven 9h-18h</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">support@emotionscare.fr</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">01 23 45 67 89</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Envoyer un Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Votre email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    placeholder="Sujet"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Textarea
                    placeholder="Votre message..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
