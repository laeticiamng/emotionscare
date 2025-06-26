
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  HelpCircle,
  Send,
  CheckCircle,
  Users,
  Building,
  Heart,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'support' | 'sales' | 'partnership' | 'feedback';
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'support'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactTypes = [
    {
      id: 'support',
      title: 'Support Technique',
      description: 'Problèmes techniques ou aide à l\'utilisation',
      icon: HelpCircle,
      color: 'bg-blue-500'
    },
    {
      id: 'sales',
      title: 'Ventes & Démonstration',
      description: 'Informations commerciales et démonstrations',
      icon: Building,
      color: 'bg-green-500'
    },
    {
      id: 'partnership',
      title: 'Partenariats',
      description: 'Opportunités de collaboration',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      id: 'feedback',
      title: 'Retours & Suggestions',
      description: 'Vos idées pour améliorer EmotionsCare',
      icon: Heart,
      color: 'bg-pink-500'
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@emotionscare.com',
      description: 'Réponse sous 24h'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+33 1 23 45 67 89',
      description: 'Lun-Ven 9h-18h'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      value: '123 Boulevard de l\'Innovation',
      description: '75015 Paris, France'
    },
    {
      icon: Clock,
      title: 'Horaires Support',
      value: '24h/24 - 7j/7',
      description: 'Chat en ligne disponible'
    }
  ];

  const faqItems = [
    {
      question: "Comment fonctionne l'analyse émotionnelle ?",
      answer: "Notre IA analyse vos expressions, votre voix et vos écrits pour détecter vos émotions en temps réel."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire et respectons le RGPD."
    },
    {
      question: "L'application est-elle gratuite ?",
      answer: "Oui, nous proposons une version gratuite avec des fonctionnalités premium optionnelles."
    },
    {
      question: "Puis-je utiliser EmotionsCare en entreprise ?",
      answer: "Oui, nous proposons des solutions B2B adaptées aux besoins des organisations."
    }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'support'
    });
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" data-testid="page-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Contactez-nous
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Notre équipe est là pour vous accompagner dans votre parcours de bien-être émotionnel. 
            N'hésitez pas à nous poser vos questions !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Envoyez-nous un message
                </CardTitle>
                <CardDescription>
                  Remplissez ce formulaire et nous vous répondrons rapidement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Type Selection */}
                  <div className="space-y-3">
                    <Label>Type de demande</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {contactTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          type="button"
                          onClick={() => handleInputChange('type', type.id as FormData['type'])}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            formData.type === type.id
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`p-1 rounded ${type.color} text-white`}>
                              <type.icon className="h-3 w-3" />
                            </div>
                            <span className="font-medium text-sm">{type.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Résumé de votre demande"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Décrivez votre demande en détail..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Envoyer le message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Informations de Contact</CardTitle>
                <CardDescription>
                  Plusieurs moyens de nous joindre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <info.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{info.title}</div>
                      <div className="text-sm text-muted-foreground">{info.value}</div>
                      <div className="text-xs text-muted-foreground">{info.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Réponse Rapide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Support technique : 2-4h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Questions commerciales : 24h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Partenariats : 48h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Support Prioritaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Besoin d'une assistance immédiate ? Nos utilisateurs Premium bénéficient 
                  d'un support prioritaire 24h/24.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Découvrir Premium
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Questions Fréquentes</CardTitle>
              <CardDescription className="text-center">
                Trouvez rapidement des réponses à vos questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">{item.question}</h4>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-6" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Vous ne trouvez pas votre réponse ?
                </p>
                <Button variant="outline">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Centre d'aide complet
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Global Presence */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <CardContent className="py-8">
              <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Présence Mondiale</h3>
              <p className="text-muted-foreground mb-6">
                EmotionsCare accompagne des utilisateurs dans plus de 50 pays à travers le monde
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">France</Badge>
                <Badge variant="secondary">Canada</Badge>
                <Badge variant="secondary">Belgique</Badge>
                <Badge variant="secondary">Suisse</Badge>
                <Badge variant="secondary">Luxembourg</Badge>
                <Badge variant="secondary">+45 autres pays</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
