
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, MessageCircle, Book, Video, ExternalLink, 
  Search, Send, Loader2, Mail, Phone, Clock, MapPin 
} from 'lucide-react';

const HelpPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const faqData = [
    {
      question: "Comment fonctionne l'analyse émotionnelle ?",
      answer: "Notre système utilise l'intelligence artificielle Hume pour analyser vos émotions à travers votre voix, vos expressions faciales ou vos écrits. L'IA détecte les nuances émotionnelles et vous fournit des insights personnalisés."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Oui, absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos informations personnelles sans votre consentement explicite."
    },
    {
      question: "Comment fonctionne la période d'essai gratuite ?",
      answer: "Tous les nouveaux comptes bénéficient de 3 jours d'accès gratuit à toutes les fonctionnalités premium. Aucune carte de crédit n'est requise pour commencer."
    },
    {
      question: "Puis-je annuler mon abonnement à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis vos paramètres de compte. Vous continuerez à avoir accès aux fonctionnalités premium jusqu'à la fin de votre période de facturation."
    },
    {
      question: "Comment générer de la musique personnalisée ?",
      answer: "Utilisez notre générateur de musique IA en décrivant l'ambiance souhaitée ou en sélectionnant une émotion. L'IA créera une composition unique adaptée à votre état émotionnel."
    },
    {
      question: "Le coach IA remplace-t-il un thérapeute ?",
      answer: "Non, notre coach IA est un outil de bien-être complémentaire. Il ne remplace pas un professionnel de santé mentale. En cas de détresse importante, consultez un spécialiste."
    }
  ];

  const tutorialVideos = [
    {
      title: "Première connexion",
      duration: "3 min",
      description: "Découvrez comment configurer votre compte et commencer votre parcours",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Scanner vos émotions",
      duration: "5 min",
      description: "Apprenez à utiliser les différents modes d'analyse émotionnelle",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Utiliser le coach IA",
      duration: "4 min",
      description: "Maximisez votre bien-être avec notre coach personnel",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Générer de la musique",
      duration: "6 min",
      description: "Créez des compositions musicales adaptées à vos émotions",
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    }
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simuler l'envoi du formulaire
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les 24 heures",
      });
      
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaq = faqData.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Centre d'aide</h1>
          <p className="text-gray-600">
            Trouvez des réponses, regardez des tutoriels et contactez notre équipe
          </p>
        </div>

        {/* Recherche */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans l'aide..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="faq" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq" className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Tutoriels</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center space-x-2">
              <Book className="h-4 w-4" />
              <span>Guides</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Contact</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
                <CardDescription>
                  Trouvez rapidement des réponses aux questions les plus courantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFaq.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                {filteredFaq.length === 0 && searchTerm && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucun résultat trouvé pour "{searchTerm}"</p>
                    <Button variant="link" onClick={() => setSearchTerm('')}>
                      Effacer la recherche
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutorials">
            <Card>
              <CardHeader>
                <CardTitle>Tutoriels vidéo</CardTitle>
                <CardDescription>
                  Apprenez à utiliser toutes les fonctionnalités de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tutorialVideos.map((video, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Video className="h-12 w-12 text-white" />
                        </div>
                        <Badge className="absolute top-2 right-2 bg-black bg-opacity-70">
                          {video.duration}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides">
            <Card>
              <CardHeader>
                <CardTitle>Guides détaillés</CardTitle>
                <CardDescription>
                  Documentation complète pour tous les aspects de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Guide de démarrage",
                      description: "Tout ce que vous devez savoir pour commencer",
                      badge: "Essentiel",
                      badgeColor: "bg-green-100 text-green-800"
                    },
                    {
                      title: "Optimiser votre bien-être",
                      description: "Conseils pour tirer le meilleur parti de la plateforme",
                      badge: "Populaire",
                      badgeColor: "bg-blue-100 text-blue-800"
                    },
                    {
                      title: "Paramètres avancés",
                      description: "Configuration approfondie de votre compte",
                      badge: "Avancé",
                      badgeColor: "bg-purple-100 text-purple-800"
                    },
                    {
                      title: "Sécurité et confidentialité",
                      description: "Protégez vos données et votre vie privée",
                      badge: "Important",
                      badgeColor: "bg-orange-100 text-orange-800"
                    }
                  ].map((guide, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <Book className="h-8 w-8 text-gray-400" />
                        <div>
                          <h3 className="font-semibold">{guide.title}</h3>
                          <p className="text-sm text-gray-600">{guide.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={guide.badgeColor}>
                          {guide.badge}
                        </Badge>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Décrivez votre question ou problème..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Informations de contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Autres moyens de contact</CardTitle>
                  <CardDescription>
                    Plusieurs façons de nous joindre selon vos préférences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-gray-600">support@emotionscare.fr</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Téléphone</div>
                        <div className="text-sm text-gray-600">+33 1 23 45 67 89</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="font-medium">Heures d'ouverture</div>
                        <div className="text-sm text-gray-600">Lun-Ven: 9h-18h</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-medium">Adresse</div>
                        <div className="text-sm text-gray-600">
                          123 Avenue de la Innovation<br />
                          75001 Paris, France
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Temps de réponse</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• Email: Sous 24h</div>
                      <div>• Téléphone: Immédiat pendant les heures d'ouverture</div>
                      <div>• Chat en ligne: Disponible bientôt</div>
                    </div>
                  </div>
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
