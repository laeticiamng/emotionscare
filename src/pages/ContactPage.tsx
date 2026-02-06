/**
 * CONTACT PAGE - EMOTIONSCARE
 * Page de contact accessible WCAG 2.1 AA
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { contactFormSchema, type ContactFormInput } from '@/lib/validation/schemas';
import { sanitizeInput } from '@/lib/validation/validator';

interface SubmissionResult {
  success: boolean;
  message: string;
  error?: string;
  data?: {
    ticketId: string;
    estimatedResponse: string;
  };
}

const ContactPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  // Focus management pour l'accessibilité
  useEffect(() => {
    document.title = "Contact | EmotionsCare - Nous contacter";
  }, []);

  const handleSubmit = async (values: ContactFormInput) => {
    try {
      // Sanitize all inputs
      const contactData = {
        name: sanitizeInput(values.name),
        email: sanitizeInput(values.email),
        subject: sanitizeInput(values.subject),
        message: sanitizeInput(values.message),
        type: 'general' as const,
        priority: 'medium' as const
      };

      const { data, error } = await supabase.functions.invoke('contact-form', {
        body: contactData
      });

      if (error) throw error;

      setIsSubmitted(true);
      setSubmissionResult(data);
      
      form.reset();
      
    } catch (error) {
      logger.error('Erreur lors de l\'envoi du formulaire', error as Error, 'SYSTEM');
      setSubmissionResult({
        success: false,
        message: 'Erreur lors de l\'envoi de votre message. Veuillez réessayer.',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
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

      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90" data-testid="page-root">
        <div className="container mx-auto px-4 py-16">
          <main id="main-content" role="main">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
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
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
                          {isSubmitted && submissionResult?.success ? (
                            <div 
                              className="bg-success/10 border border-success/30 rounded-lg p-4 mb-6"
                              role="alert"
                              aria-live="polite"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-success" aria-hidden="true" />
                                <h3 className="font-medium text-success">Message envoyé avec succès !</h3>
                              </div>
                              <p className="text-sm text-success/80 mb-3">{submissionResult.message}</p>
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
                              className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6"
                              role="alert"
                              aria-live="polite"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-5 h-5 text-destructive" aria-hidden="true" />
                                <h3 className="font-medium text-destructive">Erreur d'envoi</h3>
                              </div>
                              <p className="text-sm text-destructive/80">{submissionResult.message}</p>
                            </div>
                          ) : null}
                          
                          <fieldset className="grid sm:grid-cols-2 gap-4">
                            <legend className="sr-only">Informations personnelles</legend>
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel htmlFor="contact-name">
                                    Nom complet <span className="text-destructive" aria-label="requis">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field}
                                      id="contact-name"
                                      placeholder="Votre nom complet"
                                      aria-required="true"
                                      aria-invalid={!!form.formState.errors.name}
                                      aria-describedby={form.formState.errors.name ? "contact-name-error" : undefined}
                                    />
                                  </FormControl>
                                  <FormMessage id="contact-name-error" />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel htmlFor="contact-email">
                                    Email <span className="text-destructive" aria-label="requis">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field}
                                      id="contact-email"
                                      type="email"
                                      placeholder="votre@email.com"
                                      aria-required="true"
                                      aria-invalid={!!form.formState.errors.email}
                                      aria-describedby={form.formState.errors.email ? "contact-email-error" : undefined}
                                    />
                                  </FormControl>
                                  <FormMessage id="contact-email-error" />
                                </FormItem>
                              )}
                            />
                          </fieldset>

                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="contact-subject">
                                  Sujet <span className="text-destructive" aria-label="requis">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field}
                                    id="contact-subject"
                                    placeholder="Résumé de votre demande"
                                    aria-required="true"
                                    aria-invalid={!!form.formState.errors.subject}
                                    aria-describedby={form.formState.errors.subject ? "contact-subject-error" : undefined}
                                  />
                                </FormControl>
                                <FormMessage id="contact-subject-error" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="contact-message">
                                  Message <span className="text-destructive" aria-label="requis">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field}
                                    id="contact-message"
                                    rows={5}
                                    placeholder="Décrivez votre demande en détail..."
                                    aria-required="true"
                                    aria-invalid={!!form.formState.errors.message}
                                    aria-describedby={form.formState.errors.message ? "contact-message-error" : undefined}
                                  />
                                </FormControl>
                                <FormMessage id="contact-message-error" />
                              </FormItem>
                            )}
                          />

                          <Button 
                            type="submit" 
                            className="w-full h-12 text-base focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                            disabled={form.formState.isSubmitting}
                            aria-busy={form.formState.isSubmitting}
                          >
                            {form.formState.isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                                  role="progressbar"
                                  aria-label="Envoi en cours"
                                />
                                <span>Envoi en cours...</span>
                              </div>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                                Envoyer le message
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>
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
                        <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <h3 className="font-semibold mb-1">Siège social</h3>
                          <address className="text-muted-foreground not-italic">
                            EmotionsCare SASU<br />
                            5 rue Caudron<br />
                            80000 Amiens, France
                          </address>
                          <p className="text-sm text-muted-foreground mt-2">
                            Contact uniquement par email
                          </p>
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
                        asChild
                      >
                        <Link to="/help">Accéder au centre d'aide</Link>
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