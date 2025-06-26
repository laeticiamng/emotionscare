
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  Mail, 
  Phone,
  Search,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HelpPage: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Notre équipe vous répondra dans les plus brefs délais."
    });
    setContactForm({ subject: '', message: '', priority: 'medium' });
  };

  const faqItems = [
    {
      category: 'Utilisation',
      items: [
        {
          question: 'Comment fonctionne le scanner émotionnel ?',
          answer: 'Le scanner émotionnel utilise l\'IA pour analyser vos expressions faciales et votre voix afin de détecter votre état émotionnel actuel. Les données sont traitées localement et de manière sécurisée.'
        },
        {
          question: 'Puis-je utiliser l\'application sans connexion internet ?',
          answer: 'Certaines fonctionnalités comme le journal et les exercices de respiration sont disponibles hors ligne. Cependant, le coach IA et la synchronisation nécessitent une connexion internet.'
        },
        {
          question: 'Comment interpréter mes statistiques de bien-être ?',
          answer: 'Vos statistiques reflètent votre évolution émotionnelle sur le temps. Un score de 70-100% indique un bon équilibre, 50-70% suggère des améliorations possibles, et moins de 50% recommande un suivi plus attentif.'
        }
      ]
    },
    {
      category: 'Compte et sécurité',
      items: [
        {
          question: 'Mes données sont-elles sécurisées ?',
          answer: 'Oui, toutes vos données sont chiffrées et stockées selon les normes RGPD. Nous ne partageons jamais vos informations personnelles avec des tiers sans votre consentement explicite.'
        },
        {
          question: 'Comment modifier mon mot de passe ?',
          answer: 'Rendez-vous dans Paramètres > Sécurité > Changer le mot de passe. Vous devrez saisir votre mot de passe actuel puis le nouveau deux fois pour confirmation.'
        },
        {
          question: 'Puis-je supprimer mon compte ?',
          answer: 'Oui, vous pouvez supprimer votre compte à tout moment via Paramètres > Compte > Supprimer le compte. Cette action est irréversible et supprimera toutes vos données.'
        }
      ]
    },
    {
      category: 'Fonctionnalités',
      items: [
        {
          question: 'Comment utiliser le coach IA efficacement ?',
          answer: 'Soyez précis dans vos questions, décrivez votre situation actuelle et vos objectifs. Le coach s\'améliore avec l\'usage et s\'adapte à vos besoins spécifiques.'
        },
        {
          question: 'Que faire si la musique thérapeutique ne fonctionne pas ?',
          answer: 'Vérifiez votre connexion internet et les paramètres audio de votre appareil. Si le problème persiste, essayez de redémarrer l\'application ou contactez le support.'
        },
        {
          question: 'Comment partager mes progrès avec mon équipe (B2B) ?',
          answer: 'Dans le mode B2B, vous pouvez activer le partage anonymisé dans vos paramètres de confidentialité. Seules les tendances générales sont partagées, jamais les détails personnels.'
        }
      ]
    }
  ];

  const filteredFaq = faqItems.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Centre d'aide</h1>
        <p className="text-muted-foreground">
          Trouvez des réponses à vos questions ou contactez notre équipe support
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Vidéos
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          {filteredFaq.length > 0 ? (
            filteredFaq.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category.category}
                    <Badge variant="secondary">{category.items.length} questions</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`${categoryIndex}-${itemIndex}`}>
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
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune question trouvée pour "{searchQuery}"</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Guide de démarrage rapide', desc: 'Découvrez les bases d\'EmotionsCare', time: '5 min' },
              { title: 'Utiliser le scanner émotionnel', desc: 'Optimisez votre analyse émotionnelle', time: '8 min' },
              { title: 'Configurer vos notifications', desc: 'Personnalisez vos rappels et alertes', time: '3 min' },
              { title: 'Interpréter vos statistiques', desc: 'Comprendre votre évolution', time: '10 min' },
              { title: 'Mode B2B - Guide admin', desc: 'Gérer votre équipe efficacement', time: '15 min' },
              { title: 'Confidentialité et RGPD', desc: 'Protéger vos données personnelles', time: '7 min' }
            ].map((guide, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <Book className="h-5 w-5 text-blue-500 mt-1" />
                      <Badge variant="outline" className="text-xs">{guide.time}</Badge>
                    </div>
                    <h3 className="font-medium">{guide.title}</h3>
                    <p className="text-sm text-muted-foreground">{guide.desc}</p>
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      Lire le guide <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Présentation d\'EmotionsCare', duration: '3:45', views: '1.2k' },
              { title: 'Scanner émotionnel en action', duration: '5:20', views: '890' },
              { title: 'Coach IA - Premiers pas', duration: '4:15', views: '2.1k' },
              { title: 'Dashboard B2B - Tour complet', duration: '8:30', views: '543' }
            ].map((video, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">{video.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{video.duration}</span>
                        <span>{video.views} vues</span>
                      </div>
                      <Button className="w-full">
                        Regarder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Nous contacter</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Notre équipe support est disponible pour vous aider
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Décrivez brièvement votre demande"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Décrivez votre problème ou votre question en détail"
                      rows={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priorité</Label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((priority) => (
                        <Button
                          key={priority}
                          type="button"
                          variant={contactForm.priority === priority ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setContactForm(prev => ({ ...prev, priority }))}
                        >
                          {priority === 'low' ? 'Faible' : priority === 'medium' ? 'Normale' : 'Urgente'}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Autres moyens de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">support@emotionscare.fr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Phone className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">01 23 45 67 89</p>
                      <p className="text-xs text-muted-foreground">Lun-Ven 9h-18h</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <MessageCircle className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Chat en direct</p>
                      <p className="text-sm text-muted-foreground">Disponible 24h/7j</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Temps de réponse moyens</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Chat en direct</span>
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Immédiat
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Email</span>
                      <Badge variant="outline">2-4h</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Téléphone</span>
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Immédiat
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpPage;
