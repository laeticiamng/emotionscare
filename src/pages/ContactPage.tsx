/**
 * CONTACT PAGE - EMOTIONSCARE
 * Page de contact accessible WCAG 2.1 AA
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const ContactPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Focus management pour l'accessibilité
  useEffect(() => {
    document.title = "Contact | EmotionsCare - Nous contacter";
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      const contactData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
        type: 'general' as const,
        priority: 'medium' as const
      };

      const { data, error } = await supabase.functions.invoke('contact-form', {
        body: contactData
      });

      if (error) throw error;

      setIsSubmitted(true);
      setSubmissionResult(data);
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmissionResult({
        success: false,
        message: 'Erreur lors de l\'envoi de votre message. Veuillez réessayer.',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        tabIndex={0}
      >
        Aller au contenu principal
      </a>

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5" data-testid="page-root">
        <div className="container mx-auto px-4 py-16">
          <main id="main-content" role="main">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Contactez-nous
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Nous sommes là pour vous accompagner dans votre parcours bien-être
              </p>
            </motion.header>

            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <section aria-labelledby="contact-form-title">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle id="contact-form-title" className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                        Envoyez-nous un message
                      </CardTitle>
                      <CardDescription>
                        Nous vous répondrons dans les plus brefs délais
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {isSubmitted && submissionResult?.success ? (
                          <div 
                            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                            role="alert"
                            aria-live="polite"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
                              <h3 className="font-medium text-green-800">Message envoyé avec succès !</h3>
                            </div>
                            <p className="text-sm text-green-700 mb-3">{submissionResult.message}</p>
                            {submissionResult.data && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">Ticket: {submissionResult.data.ticketId}</Badge>
                                  <Badge variant="secondary">Réponse: {submissionResult.data.estimatedResponse}</Badge>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : null}
                        
                        {submissionResult && !submissionResult.success ? (
                          <div 
                            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                            role="alert"
                            aria-live="polite"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-5 h-5 text-red-600" aria-hidden="true" />
                              <h3 className="font-medium text-red-800">Erreur d'envoi</h3>
                            </div>
                            <p className="text-sm text-red-700">{submissionResult.message}</p>
                          </div>
                        ) : null}
                        
                        <fieldset className="grid sm:grid-cols-2 gap-4">
                          <legend className="sr-only">Informations personnelles</legend>
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2">
                              Nom complet <span className="text-red-500" aria-label="requis">*</span>
                            </label>
                            <Input 
                              id="name" 
                              name="name" 
                              placeholder="Votre nom complet"
                              required 
                              disabled={isLoading}
                              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                              aria-describedby="name-error"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                              Email <span className="text-red-500" aria-label="requis">*</span>
                            </label>
                            <Input 
                              id="email" 
                              name="email" 
                              type="email" 
                              placeholder="votre@email.com"
                              required 
                              disabled={isLoading}
                              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                              aria-describedby="email-error"
                            />
                          </div>
                        </fieldset>

                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium mb-2">
                            Sujet <span className="text-red-500" aria-label="requis">*</span>
                          </label>
                          <Input 
                            id="subject" 
                            name="subject" 
                            placeholder="Résumé de votre demande"
                            required 
                            disabled={isLoading}
                            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            aria-describedby="subject-error"
                          />
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-medium mb-2">
                            Message <span className="text-red-500" aria-label="requis">*</span>
                          </label>
                          <Textarea 
                            id="message" 
                            name="message" 
                            rows={5}
                            placeholder="Décrivez votre demande en détail..."
                            required 
                            disabled={isLoading}
                            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            aria-describedby="message-error"
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full h-12 text-base focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                          disabled={isLoading}
                          aria-describedby={isLoading ? "submit-status" : undefined}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                                role="progressbar"
                                aria-label="Envoi en cours"
                              />
                              <span id="submit-status">Envoi en cours...</span>
                            </div>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                              Envoyer le message
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </section>

              {/* Contact Info */}
              <section aria-labelledby="contact-info-title">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle id="contact-info-title">Informations de contact</CardTitle>
                      <CardDescription>
                        Plusieurs moyens de nous joindre
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <h3 className="font-semibold mb-1">Email</h3>
                          <p className="text-muted-foreground">
                            <a 
                              href="mailto:contact@emotionscare.com"
                              className="hover:text-primary focus:text-primary focus:underline focus:outline-none"
                              aria-label="Envoyer un email à contact@emotionscare.com"
                            >
                              contact@emotionscare.com
                            </a>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Réponse sous 24h en moyenne
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <h3 className="font-semibold mb-1">Téléphone</h3>
                          <p className="text-muted-foreground">
                            <a 
                              href="tel:+33123456789"
                              className="hover:text-primary focus:text-primary focus:underline focus:outline-none"
                              aria-label="Appeler le +33 1 23 45 67 89"
                            >
                              +33 1 23 45 67 89
                            </a>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Lundi au vendredi, 9h-18h
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <h3 className="font-semibold mb-1">Adresse</h3>
                          <address className="text-muted-foreground not-italic">
                            123 Avenue de l'Innovation<br />
                            75001 Paris, France  
                          </address>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Support technique</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Pour une assistance technique immédiate, consultez notre centre d'aide 
                        ou contactez notre équipe support.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label="Accéder au centre d'aide EmotionsCare"
                      >
                        Accéder au centre d'aide
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ContactPage;