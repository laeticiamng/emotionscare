
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Mail, 
  Phone, 
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const HelpPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSending, setIsSending] = useState(false);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'Comment fonctionne l\'analyse émotionnelle ?',
      answer: 'Notre système utilise l\'intelligence artificielle Hume pour analyser vos émotions à travers la voix, le texte ou les expressions faciales. L\'IA identifie les émotions principales avec un niveau de confiance et propose des suggestions personnalisées.',
      category: 'fonctionnalités'
    },
    {
      id: '2',
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos informations personnelles sans votre consentement explicite.',
      category: 'sécurité'
    },
    {
      id: '3',
      question: 'Comment générer de la musique thérapeutique ?',
      answer: 'Rendez-vous dans la section Musique, décrivez l\'ambiance souhaitée ou sélectionnez une émotion. Notre IA génère alors une composition musicale personnalisée adaptée à votre état émotionnel.',
      category: 'fonctionnalités'
    },
    {
      id: '4',
      question: 'Que faire si je ne reçois pas l\'email de confirmation ?',
      answer: 'Vérifiez votre dossier spam. Si l\'email n\'est toujours pas là, contactez-nous à support@emotionscare.fr avec votre adresse email et nous vous aiderons.',
      category: 'compte'
    },
    {
      id: '5',
      question: 'Comment fonctionne la période d\'essai gratuite ?',
      answer: 'Tous les nouveaux comptes bénéficient de 3 jours d\'accès gratuit à toutes les fonctionnalités premium. Aucune carte bancaire n\'est requise pour commencer.',
      category: 'compte'
    },
    {
      id: '6',
      question: 'Le coach IA peut-il remplacer un thérapeute ?',
      answer: 'Non, notre coach IA est un outil d\'accompagnement complémentaire. Pour des problèmes de santé mentale sérieux, nous recommandons fortement de consulter un professionnel de santé qualifié.',
      category: 'conseils'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.subject || !contactForm.message) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    
    try {
      // Simulation d'envoi pour les comptes démo et réels
      setTimeout(() => {
        toast({
          title: "Message envoyé",
          description: "Nous vous répondrons sous 24h",
        });
        setContactForm({ subject: '', message: '', category: 'general' });
        setIsSending(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer votre message",
        variant: "destructive"
      });
      setIsSending(false);
    }
  };

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  const isDemo = user?.email?.endsWith('@exemple.fr');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Centre d'aide</h1>
        <p className="text-gray-600">
          Trouvez des réponses à vos questions ou contactez notre équipe
        </p>
        {isDemo && (
          <div className="mt-2 bg-orange-100 border border-orange-200 rounded-lg p-2">
            <p className="text-sm text-orange-800">
              🎯 Compte de démonstration - Support simulé
            </p>
          </div>
        )}
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq" className="flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center">
            <Book className="h-4 w-4 mr-2" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquemment posées</CardTitle>
              <CardDescription>
                Trouvez rapidement des réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher dans la FAQ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border rounded-lg">
                    <button
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span className="font-medium">{faq.question}</span>
                      {openFaq === faq.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-4 pb-3 text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucune question trouvée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Guide de démarrage</CardTitle>
                <CardDescription>
                  Apprenez les bases d'EmotionsCare
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      Créer votre premier scan émotionnel
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      Utiliser le coach IA efficacement
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      Personnaliser votre profil
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités avancées</CardTitle>
                <CardDescription>
                  Exploitez tout le potentiel de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      Analyser vos tendances émotionnelles
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      Créer des playlists musicales thérapeutiques
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      Tenir un journal efficace
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Entreprises</CardTitle>
                <CardDescription>
                  Guides pour les comptes professionnels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      Configurer votre organisation
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      Inviter des collaborateurs
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      Analyser le bien-être de l'équipe
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sécurité & Confidentialité</CardTitle>
                <CardDescription>
                  Protégez vos données personnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      Comprendre notre politique de confidentialité
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      Gérer vos données personnelles
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      Sécuriser votre compte
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Nous contacter</CardTitle>
                <CardDescription>
                  Envoyez-nous un message, nous vous répondrons rapidement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <select
                      id="category"
                      value={contactForm.category}
                      onChange={(e) => setContactForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="general">Question générale</option>
                      <option value="technical">Problème technique</option>
                      <option value="billing">Facturation</option>
                      <option value="feature">Suggestion de fonctionnalité</option>
                      <option value="bug">Signaler un bug</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Résumez votre demande en quelques mots"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Décrivez votre demande en détail..."
                      rows={6}
                    />
                  </div>

                  <Button type="submit" disabled={isSending} className="w-full">
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer le message'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Autres moyens de contact</CardTitle>
                <CardDescription>
                  Différentes façons de nous joindre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-gray-600">support@emotionscare.fr</p>
                    <p className="text-xs text-gray-500">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Téléphone</h3>
                    <p className="text-sm text-gray-600">+33 1 23 45 67 89</p>
                    <p className="text-xs text-gray-500">Lun-Ven 9h-18h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Chat en direct</h3>
                    <p className="text-sm text-gray-600">Disponible dans l'application</p>
                    <p className="text-xs text-gray-500">Lun-Ven 9h-18h</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Urgence</h3>
                  <p className="text-sm text-gray-600">
                    En cas de crise ou de pensées suicidaires, contactez immédiatement :
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm"><strong>Suicide Écoute :</strong> 01 45 39 40 00</p>
                    <p className="text-sm"><strong>SOS Amitié :</strong> 09 72 39 40 50</p>
                    <p className="text-sm"><strong>Urgences :</strong> 15 (SAMU)</p>
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
