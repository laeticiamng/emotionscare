
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  Video,
  ExternalLink,
  Send,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'Comment commencer à utiliser EmotionsCare ?',
      answer: 'Créez votre compte, complétez votre profil, puis utilisez le scanner d\'émotions pour votre première analyse. Consultez ensuite vos recommandations personnalisées.',
      category: 'getting-started'
    },
    {
      id: '2',
      question: 'Comment fonctionne l\'analyse des émotions ?',
      answer: 'Notre IA analyse vos émotions via texte, audio ou sélection d\'émojis. L\'analyse combine plusieurs techniques d\'intelligence artificielle pour comprendre votre état émotionnel.',
      category: 'features'
    },
    {
      id: '3',
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Oui, toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos données personnelles sans votre consentement.',
      category: 'privacy'
    },
    {
      id: '4',
      question: 'Comment accéder au mode entreprise ?',
      answer: 'Sélectionnez "Mode Entreprise" lors de l\'inscription ou contactez notre équipe commerciale pour configurer un compte entreprise avec des fonctionnalités avancées.',
      category: 'b2b'
    },
    {
      id: '5',
      question: 'Puis-je exporter mes données ?',
      answer: 'Oui, vous pouvez exporter toutes vos données depuis la page Paramètres. Cela inclut vos analyses d\'émotions, entrées de journal et paramètres de profil.',
      category: 'account'
    },
    {
      id: '6',
      question: 'Comment fonctionne la musique thérapeutique ?',
      answer: 'Notre IA génère ou recommande de la musique basée sur votre état émotionnel actuel pour vous aider à améliorer votre bien-être ou maintenir un état positif.',
      category: 'features'
    }
  ];

  const categories = [
    { id: 'all', label: 'Toutes les catégories' },
    { id: 'getting-started', label: 'Premiers pas' },
    { id: 'features', label: 'Fonctionnalités' },
    { id: 'account', label: 'Compte' },
    { id: 'privacy', label: 'Confidentialité' },
    { id: 'b2b', label: 'Entreprise' }
  ];

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      toast.error('Veuillez saisir votre message');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Message envoyé ! Nous vous répondrons dans les 24h.');
      setSupportMessage('');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Centre d'aide</h1>
          <p className="text-muted-foreground text-lg">
            Trouvez les réponses à vos questions ou contactez notre équipe
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="flex flex-col items-center p-6">
                  <Video className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Tutoriels vidéo</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Guides visuels étape par étape
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="flex flex-col items-center p-6">
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Documentation</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Guide complet d'utilisation
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="flex flex-col items-center p-6">
                  <MessageCircle className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Chat en direct</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Support instantané
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-800">En ligne</Badge>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="flex flex-col items-center p-6">
                  <ExternalLink className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Blog</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Conseils et actualités
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Questions fréquentes
                </CardTitle>
                <CardDescription>
                  Trouvez rapidement les réponses à vos questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher dans la FAQ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* FAQ Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQ.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFAQ.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Aucune question trouvée. Essayez d'autres termes de recherche.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contactez-nous</CardTitle>
                <CardDescription>
                  Notre équipe est là pour vous aider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <Textarea
                    placeholder="Décrivez votre problème ou votre question..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    rows={4}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Autres moyens de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">support@emotionscare.fr</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Heures d'ouverture: Lun-Ven 9h-18h (CET)
                  </p>
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
                    Guide de démarrage rapide
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="h-4 w-4 mr-2" />
                    Tutoriels vidéo
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Base de connaissances
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpPage;
