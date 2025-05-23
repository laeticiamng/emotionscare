
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone,
  ChevronDown,
  ChevronRight,
  Heart,
  Users,
  Settings,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HelpPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Premiers pas',
      icon: Heart,
      questions: [
        {
          id: '1',
          question: 'Comment créer mon premier scan émotionnel ?',
          answer: 'Rendez-vous sur votre tableau de bord et cliquez sur "Nouvelle analyse". Choisissez votre méthode préférée (texte, audio, ou émojis) et suivez les instructions.'
        },
        {
          id: '2',
          question: 'Que signifie mon score émotionnel ?',
          answer: 'Votre score émotionnel est calculé sur 100 points. Il reflète votre état de bien-être général basé sur vos réponses et analyses. Plus le score est élevé, meilleur est votre état émotionnel.'
        },
        {
          id: '3',
          question: 'À quelle fréquence dois-je faire des scans ?',
          answer: 'Nous recommandons de faire au moins un scan par jour pour un suivi optimal. Vous pouvez en faire plus selon vos besoins et votre emploi du temps.'
        }
      ]
    },
    {
      id: 'features',
      title: 'Fonctionnalités',
      icon: Settings,
      questions: [
        {
          id: '4',
          question: 'Comment fonctionne l\'analyse par IA ?',
          answer: 'Notre IA analyse vos expressions textuelles, vocales ou émotionnelles pour comprendre votre état émotionnel. Elle utilise des modèles avancés de traitement du langage naturel et d\'analyse émotionnelle.'
        },
        {
          id: '5',
          question: 'Puis-je partager mes résultats ?',
          answer: 'Oui, vous pouvez choisir de partager vos insights dans l\'espace social, mais toujours de manière anonymisée et selon vos préférences de confidentialité.'
        },
        {
          id: '6',
          question: 'Comment rejoindre une communauté ?',
          answer: 'Allez dans l\'espace social, parcourez les communautés disponibles et cliquez sur "Rejoindre" pour celles qui vous intéressent.'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Confidentialité',
      icon: Shield,
      questions: [
        {
          id: '7',
          question: 'Mes données sont-elles sécurisées ?',
          answer: 'Absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos informations personnelles sans votre consentement.'
        },
        {
          id: '8',
          question: 'Qui peut voir mes analyses émotionnelles ?',
          answer: 'Seul vous avez accès à vos analyses détaillées. Les administrateurs B2B peuvent voir des données agrégées et anonymisées pour les rapports d\'équipe.'
        },
        {
          id: '9',
          question: 'Puis-je supprimer mes données ?',
          answer: 'Oui, vous pouvez demander la suppression de toutes vos données à tout moment depuis les paramètres de votre compte ou en nous contactant directement.'
        }
      ]
    },
    {
      id: 'b2b',
      title: 'Solutions entreprise',
      icon: Users,
      questions: [
        {
          id: '10',
          question: 'Comment fonctionne la version entreprise ?',
          answer: 'La version B2B permet aux organisations de suivre le bien-être de leurs équipes avec des tableaux de bord administrateurs, des rapports agrégés et des outils de gestion des utilisateurs.'
        },
        {
          id: '11',
          question: 'Comment inviter des collaborateurs ?',
          answer: 'Les administrateurs peuvent envoyer des invitations par email depuis l\'interface d\'administration. Les collaborateurs recevront un lien pour créer leur compte.'
        },
        {
          id: '12',
          question: 'Quels rapports sont disponibles ?',
          answer: 'Les administrateurs ont accès à des rapports sur les tendances d\'équipe, les alertes de bien-être, et des analytics détaillés tout en respectant la confidentialité individuelle.'
        }
      ]
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simuler l'envoi du message
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
      variant: "success"
    });

    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Centre d'aide EmotionsCare</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Trouvez des réponses à vos questions et obtenez de l'aide pour utiliser EmotionsCare
        </p>
      </div>

      {/* Recherche */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans l'aide..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">
            <Book className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact">
            <MessageCircle className="h-4 w-4 mr-2" />
            Nous contacter
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Heart className="h-4 w-4 mr-2" />
            Ressources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    {category.title}
                    <Badge variant="outline">{category.questions.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.questions.map((faq) => (
                    <div key={faq.id} className="border rounded-lg">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted/50"
                      >
                        <span className="font-medium">{faq.question}</span>
                        {expandedFaq === faq.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-4 pb-3 text-muted-foreground">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'Aucun résultat trouvé pour votre recherche.' : 'Utilisez la barre de recherche pour trouver des réponses.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulaire de contact */}
            <Card>
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Notre équipe vous répondra dans les plus brefs délais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Votre nom"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Votre email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <Input
                    placeholder="Sujet de votre message"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                  <Textarea
                    placeholder="Votre message..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={5}
                    required
                  />
                  <Button type="submit" className="w-full">
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Informations de contact */}
            <Card>
              <CardHeader>
                <CardTitle>Autres moyens de nous contacter</CardTitle>
                <CardDescription>
                  Choisissez le canal qui vous convient le mieux
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">support@emotionscare.fr</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <Phone className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                    <p className="text-xs text-muted-foreground">Lun-Ven 9h-18h</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Chat en direct</p>
                    <p className="text-sm text-muted-foreground">Disponible depuis votre tableau de bord</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Temps de réponse moyens</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Email : 2-4 heures</li>
                    <li>• Téléphone : Immédiat</li>
                    <li>• Chat : 1-2 minutes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Guide de démarrage</CardTitle>
                <CardDescription>Premiers pas avec EmotionsCare</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Apprenez les bases pour tirer le meilleur parti de votre expérience.
                </p>
                <Button variant="outline" className="w-full">
                  Consulter le guide
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bonnes pratiques</CardTitle>
                <CardDescription>Optimisez votre bien-être</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Découvrez les meilleures techniques pour améliorer votre santé mentale.
                </p>
                <Button variant="outline" className="w-full">
                  Lire les conseils
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentation API</CardTitle>
                <CardDescription>Pour les développeurs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Intégrez EmotionsCare dans vos applications.
                </p>
                <Button variant="outline" className="w-full">
                  Voir l'API
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpPage;
