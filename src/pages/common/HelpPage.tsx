
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs: FAQ[] = [
    {
      question: "Comment commencer une analyse émotionnelle ?",
      answer: "Pour commencer une analyse, cliquez sur le bouton 'Analyser mes émotions' depuis votre tableau de bord. Vous pouvez choisir entre l'analyse textuelle, vocale ou par émojis selon votre préférence.",
      category: "Analyse"
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Oui, nous utilisons un chiffrement de niveau bancaire pour protéger vos données. Vos analyses personnelles ne sont jamais partagées sans votre consentement explicite.",
      category: "Sécurité"
    },
    {
      question: "Comment interpréter mon score de bien-être ?",
      answer: "Votre score de bien-être va de 0 à 100. Un score de 80+ indique un excellent état, 60-79 est bon, 40-59 est moyen, et en dessous de 40 suggère de prendre soin de votre bien-être.",
      category: "Analyse"
    },
    {
      question: "Puis-je utiliser EmotionsCare sur mobile ?",
      answer: "EmotionsCare est une application web responsive qui fonctionne parfaitement sur tous les appareils mobiles via votre navigateur.",
      category: "Technique"
    },
    {
      question: "Comment inviter des collègues (version B2B) ?",
      answer: "En tant qu'administrateur, allez dans la section 'Gestion des utilisateurs' et cliquez sur 'Inviter un utilisateur'. Saisissez l'email de votre collègue et il recevra une invitation.",
      category: "B2B"
    },
    {
      question: "Comment modifier mes paramètres de notification ?",
      answer: "Allez dans Paramètres > Notifications pour personnaliser vos préférences de notification pour les emails, rappels d'analyse et activité communautaire.",
      category: "Paramètres"
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Votre message a été envoyé ! Nous vous répondrons sous 24h.");
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleFormChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Centre d'aide</h1>
        <p className="text-muted-foreground">
          Trouvez des réponses à vos questions et obtenez de l'aide
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Book className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Documentation</h3>
            <p className="text-sm text-muted-foreground">
              Guides complets et documentation API
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Video className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Tutoriels vidéo</h3>
            <p className="text-sm text-muted-foreground">
              Apprenez avec nos tutoriels step-by-step
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Chat support</h3>
            <p className="text-sm text-muted-foreground">
              Obtenez de l'aide en temps réel
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2 h-5 w-5" />
            Questions fréquentes
          </CardTitle>
          <CardDescription>
            Les réponses aux questions les plus courantes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans les FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="border rounded-lg">
                <button
                  className="w-full p-4 text-left flex justify-between items-center hover:bg-muted/50"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                >
                  <div>
                    <h4 className="font-medium">{faq.question}</h4>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                      {faq.category}
                    </span>
                  </div>
                  {expandedFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="p-4 border-t bg-muted/20">
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Aucun résultat trouvé</h3>
              <p className="text-sm text-muted-foreground">
                Essayez d'autres mots-clés ou contactez notre support
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Section */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  value={contactForm.subject}
                  onChange={(e) => handleFormChange('subject', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) => handleFormChange('message', e.target.value)}
                  className="min-h-24"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Envoyer le message
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
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm text-muted-foreground">support@emotionscare.fr</p>
                  <p className="text-xs text-muted-foreground">Réponse sous 24h</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Téléphone</h4>
                  <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                  <p className="text-xs text-muted-foreground">Lun-Ven 9h-18h</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Chat en direct</h4>
                  <p className="text-sm text-muted-foreground">Disponible dans l'app</p>
                  <p className="text-xs text-muted-foreground">Lun-Ven 9h-17h</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Temps de réponse</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Chat en direct: Immédiat</p>
                <p>• Email: 24h maximum</p>
                <p>• Téléphone: Immédiat aux heures d'ouverture</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;
