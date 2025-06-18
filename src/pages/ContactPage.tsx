
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Shield } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi - en production, connecter à un service d'email
    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-blue-500" />,
      title: "Email",
      content: "contact@emotionscare.fr",
      description: "Réponse sous 24h"
    },
    {
      icon: <Phone className="h-6 w-6 text-green-500" />,
      title: "Téléphone",
      content: "+33 1 23 45 67 89",
      description: "Du lundi au vendredi, 9h-18h"
    },
    {
      icon: <MapPin className="h-6 w-6 text-red-500" />,
      title: "Adresse",
      content: "123 Avenue des Innovations\n75001 Paris, France",
      description: "Siège social"
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      title: "Horaires",
      content: "Lun-Ven: 9h-18h\nSam: 10h-16h",
      description: "Support client"
    }
  ];

  const supportTypes = [
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-500" />,
      title: "Support Technique",
      description: "Aide avec l'utilisation de la plateforme",
      email: "support@emotionscare.fr"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Partenariats B2B",
      description: "Solutions pour entreprises",
      email: "business@emotionscare.fr"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      title: "Confidentialité",
      description: "Questions sur la protection des données",
      email: "privacy@emotionscare.fr"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Contactez-nous
          </Badge>
          <h1 className="text-4xl font-bold mb-6">
            Nous sommes là pour vous aider
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une question, un problème ou simplement envie d'échanger ? 
            Notre équipe est à votre disposition pour vous accompagner.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Envoyez-nous un message
                </CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nom complet *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="votre@email.fr"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Sujet *
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="De quoi souhaitez-vous parler ?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Décrivez votre demande en détail..."
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
                <CardDescription>
                  Plusieurs moyens de nous joindre selon vos préférences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    {info.icon}
                    <div>
                      <h3 className="font-semibold">{info.title}</h3>
                      <p className="text-sm whitespace-pre-line">{info.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support spécialisé</CardTitle>
                <CardDescription>
                  Contactez directement le service adapté à votre demande
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportTypes.map((support, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-center gap-3 mb-2">
                      {support.icon}
                      <h3 className="font-semibold">{support.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{support.description}</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${support.email}`}>
                        Contacter par email
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Preview */}
        <section className="mt-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Questions fréquentes</CardTitle>
              <CardDescription>
                Peut-être trouverez-vous votre réponse ici
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Comment fonctionne le scan émotionnel ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Notre IA analyse votre voix, expressions faciales et réponses pour évaluer votre état émotionnel.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Mes données sont-elles sécurisées ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Oui, nous respectons strictement le RGPD et chiffrons toutes vos données personnelles.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Puis-je annuler mon abonnement ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Oui, vous pouvez annuler à tout moment depuis vos paramètres de compte.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Y a-t-il une version d'essai gratuite ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Oui, profitez de 14 jours d'essai gratuit pour découvrir toutes nos fonctionnalités.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
