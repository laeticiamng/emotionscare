
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-blue-500" />,
      title: "Email",
      content: "contact@emotionscare.com",
      description: "Nous répondons sous 24h"
    },
    {
      icon: <Phone className="h-6 w-6 text-green-500" />,
      title: "Téléphone",
      content: "+33 1 23 45 67 89",
      description: "Lun-Ven 9h-18h"
    },
    {
      icon: <MapPin className="h-6 w-6 text-red-500" />,
      title: "Adresse",
      content: "123 Rue du Bien-être, 75001 Paris",
      description: "France"
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      title: "Horaires",
      content: "Lundi - Vendredi",
      description: "9h00 - 18h00"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Informations de contact */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          {info.icon}
                          <CardTitle className="text-lg">{info.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium mb-1">{info.content}</p>
                        <CardDescription>{info.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Formulaire de contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" placeholder="Votre prénom" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" placeholder="Votre nom" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input id="subject" placeholder="Sujet de votre message" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Décrivez votre demande..."
                      rows={5}
                    />
                  </div>
                  <Button className="w-full">
                    Envoyer le message
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
