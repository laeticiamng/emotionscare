
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  MessageSquare, 
  Mail, 
  Phone, 
  BookOpen,
  Brain,
  Heart,
  Music,
  Users,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    email: ''
  });
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Premiers pas',
      icon: BookOpen,
      questions: [
        {
          id: 'what-is-emotionscare',
          question: 'Qu\'est-ce qu\'EmotionsCare ?',
          answer: 'EmotionsCare est une plateforme de bien-être émotionnel alimentée par l\'IA qui vous aide à comprendre, analyser et améliorer votre état émotionnel grâce à des outils innovants comme le scanner d\'émotions, le coach IA, et la musique thérapeutique.'
        },
        {
          id: 'how-to-start',
          question: 'Comment commencer ?',
          answer: 'Après votre inscription, suivez le processus d\'onboarding qui vous présente les différentes fonctionnalités. Commencez par scanner vos émotions pour établir une base, puis explorez le coach IA et les autres outils.'
        },
        {
          id: 'free-trial',
          question: 'Comment fonctionne la période d\'essai gratuite ?',
          answer: 'Vous bénéficiez de 3 jours d\'accès complet à toutes les fonctionnalités premium. Aucune carte bancaire n\'est requise pour démarrer votre essai.'
        }
      ]
    },
    {
      id: 'emotion-scanner',
      title: 'Scanner d\'émotions',
      icon: Brain,
      questions: [
        {
          id: 'how-scanner-works',
          question: 'Comment fonctionne le scanner d\'émotions ?',
          answer: 'Le scanner analyse vos textes, émojis et bientôt votre voix pour identifier votre état émotionnel. Il utilise l\'IA avancée pour fournir des insights précis sur votre humeur et des recommandations personnalisées.'
        },
        {
          id: 'accuracy',
          question: 'Quelle est la précision des analyses ?',
          answer: 'Nos analyses atteignent généralement 80-90% de précision. Plus vous utilisez l\'outil, plus il s\'améliore en apprenant vos patterns émotionnels.'
        },
        {
          id: 'data-privacy',
          question: 'Mes données émotionnelles sont-elles sécurisées ?',
          answer: 'Oui, toutes vos données sont chiffrées et stockées de manière sécurisée. Nous ne partageons jamais vos informations personnelles avec des tiers.'
        }
      ]
    },
    {
      id: 'ai-coach',
      title: 'Coach IA',
      icon: Heart,
      questions: [
        {
          id: 'coach-capabilities',
          question: 'Que peut faire le coach IA ?',
          answer: 'Le coach IA peut vous aider avec la gestion du stress, l\'anxiété, la motivation, les relations, l\'équilibre vie-travail et bien plus. Il adapte ses conseils à votre situation personnelle.'
        },
        {
          id: 'coach-vs-therapist',
          question: 'Le coach IA remplace-t-il un thérapeute ?',
          answer: 'Non, le coach IA est un outil de soutien et ne remplace pas un professionnel de la santé mentale. Pour des problèmes sérieux, consultez toujours un professionnel qualifié.'
        }
      ]
    },
    {
      id: 'music-therapy',
      title: 'Musique thérapeutique',
      icon: Music,
      questions: [
        {
          id: 'music-generation',
          question: 'Comment la musique est-elle générée ?',
          answer: 'Notre IA analyse votre état émotionnel et génère de la musique personnalisée adaptée à vos besoins. Vous pouvez spécifier l\'émotion souhaitée et le type de musique.'
        },
        {
          id: 'music-formats',
          question: 'Dans quels formats puis-je télécharger la musique ?',
          answer: 'La musique générée est disponible en MP3 haute qualité. Vous pouvez l\'écouter en streaming ou la télécharger pour une utilisation hors ligne.'
        }
      ]
    },
    {
      id: 'b2b',
      title: 'Solutions entreprise',
      icon: Users,
      questions: [
        {
          id: 'b2b-features',
          question: 'Quelles fonctionnalités sont disponibles pour les entreprises ?',
          answer: 'Les entreprises bénéficient d\'analytics avancés, de tableaux de bord administrateur, de gestion d\'équipes, et de rapports sur le bien-être des collaborateurs.'
        },
        {
          id: 'employee-privacy',
          question: 'Comment la vie privée des employés est-elle protégée ?',
          answer: 'Les données individuelles restent anonymisées pour les administrateurs. Seuls les trends globaux et statistiques agrégées sont visibles.'
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const sendMessage = async () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      // Simuler l'envoi du message
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message envoyé ! Nous vous répondrons sous 24h.');
      setContactForm({ subject: '', message: '', email: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
          <HelpCircle className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Centre d'aide</h1>
          <p className="text-muted-foreground">Trouvez rapidement les réponses à vos questions</p>
        </div>
      </div>

      {/* Recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'aide..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold">Questions fréquentes</h2>
          
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez d'autres termes de recherche ou contactez notre support
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQs.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {category.questions.map((faq) => (
                    <Collapsible
                      key={faq.id}
                      open={openFAQ === faq.id}
                      onOpenChange={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-3 h-auto text-left"
                        >
                          <span className="font-medium">{faq.question}</span>
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-3">
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Contact et ressources */}
        <div className="space-y-4">
          {/* Contact rapide */}
          <Card>
            <CardHeader>
              <CardTitle>Besoin d'aide ?</CardTitle>
              <CardDescription>
                Notre équipe est là pour vous aider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">support@emotionscare.fr</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Chat en direct</div>
                  <div className="text-sm text-muted-foreground">Disponible 9h-18h</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Téléphone</div>
                  <div className="text-sm text-muted-foreground">+33 1 23 45 67 89</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de contact */}
          <Card>
            <CardHeader>
              <CardTitle>Nous contacter</CardTitle>
              <CardDescription>
                Envoyez-nous un message
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Sujet de votre message"
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
              />
              
              <Textarea
                placeholder="Décrivez votre problème ou question..."
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                className="min-h-[100px]"
              />
              
              <Button onClick={sendMessage} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Envoyer le message
              </Button>
            </CardContent>
          </Card>

          {/* Ressources utiles */}
          <Card>
            <CardHeader>
              <CardTitle>Ressources utiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Guide de démarrage
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <Heart className="mr-2 h-4 w-4" />
                Conseils bien-être
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Communauté
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
