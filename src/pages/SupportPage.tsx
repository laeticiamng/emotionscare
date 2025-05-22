
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MessageCircle, FileText, HelpCircle, Send } from 'lucide-react';
import Shell from '@/Shell';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Veuillez entrer une adresse e-mail valide'),
  subject: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const SupportPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });
  
  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      // Simuler l'envoi d'un message
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form data:', data);
      setIsSubmitted(true);
      toast.success('Message envoyé avec succès. Nous vous répondrons prochainement.');
    } catch (error) {
      console.error('Erreur d\'envoi:', error);
      toast.error('Une erreur est survenue lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setIsSubmitted(false);
    form.reset();
  };
  
  const faqItems = [
    {
      question: 'Comment puis-je créer un compte ?',
      answer: 'Vous pouvez créer un compte en cliquant sur le bouton "S\'inscrire" en haut à droite de la page d\'accueil. Suivez ensuite les instructions pour compléter votre inscription.',
    },
    {
      question: 'Comment fonctionne le journal émotionnel ?',
      answer: 'Le journal émotionnel vous permet d\'enregistrer quotidiennement vos émotions et de suivre leur évolution au fil du temps. Vous pouvez ajouter des entrées, ajouter des notes et visualiser vos tendances émotionnelles via des graphiques.',
    },
    {
      question: 'Est-ce que mes données sont sécurisées ?',
      answer: 'Oui, la protection de vos données est notre priorité. Toutes les informations sont cryptées et nous ne partageons jamais vos données avec des tiers sans votre consentement explicite.',
    },
    {
      question: 'Comment puis-je réinitialiser mon mot de passe ?',
      answer: 'Vous pouvez réinitialiser votre mot de passe en cliquant sur "Mot de passe oublié ?" sur la page de connexion. Un e-mail avec les instructions de réinitialisation vous sera envoyé.',
    },
    {
      question: 'Puis-je utiliser l\'application sur mobile ?',
      answer: 'Oui, notre application est conçue de manière responsive et fonctionne sur tous les appareils, y compris les smartphones et tablettes. Une application mobile native sera également bientôt disponible.',
    },
    {
      question: 'Comment puis-je supprimer mon compte ?',
      answer: 'Pour supprimer votre compte, accédez à vos paramètres de profil et cliquez sur "Supprimer mon compte". Veuillez noter que cette action est irréversible et que toutes vos données seront définitivement supprimées.',
    },
  ];
  
  return (
    <Shell>
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Centre d'assistance</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nous sommes là pour vous aider. Consultez notre FAQ ou contactez-nous directement.
            </p>
          </div>
          
          <Tabs defaultValue="contact" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Contact</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Documentation</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact" className="space-y-6">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                {!isSubmitted ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input placeholder="Jean Dupont" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="email@exemple.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sujet</FormLabel>
                            <FormControl>
                              <Input placeholder="En quoi pouvons-nous vous aider ?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Décrivez votre problème ou question en détail..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="flex items-center gap-2"
                        >
                          {isSubmitting ? 'Envoi en cours...' : (
                            <>
                              <Send className="h-4 w-4" />
                              Envoyer le message
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <motion.div 
                    className="text-center py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-8 w-8"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message envoyé</h3>
                    <p className="text-muted-foreground mb-6">
                      Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
                    </p>
                    <Button onClick={resetForm}>Envoyer un nouveau message</Button>
                  </motion.div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg border p-6 text-center">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Chat en direct</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Discutez avec notre équipe d'assistance en temps réel.
                  </p>
                  <Button variant="outline" size="sm">
                    Démarrer le chat
                  </Button>
                </div>
                
                <div className="bg-card rounded-lg border p-6 text-center">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <h3 className="font-medium mb-2">Téléphone</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Du lundi au vendredi, de 9h à 18h.
                  </p>
                  <Button variant="outline" size="sm">
                    +33 1 23 45 67 89
                  </Button>
                </div>
                
                <div className="bg-card rounded-lg border p-6 text-center">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <h3 className="font-medium mb-2">Email</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Nous répondons généralement sous 24h.
                  </p>
                  <Button variant="outline" size="sm">
                    support@emotionscare.com
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="faq">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Questions fréquemment posées</h2>
                
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        <p>{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                <div className="mt-8 p-4 bg-muted rounded-lg text-center">
                  <p className="text-muted-foreground mb-2">
                    Vous ne trouvez pas la réponse à votre question ?
                  </p>
                  <Button onClick={() => document.querySelector('[data-value="contact"]')?.click()}>
                    Contactez-nous
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="docs">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Documentation</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="rounded-lg border p-4 hover:bg-accent transition-colors">
                    <h3 className="font-medium mb-2">Guide de démarrage</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Apprenez les bases de l'application et comment configurer votre compte.
                    </p>
                    <Button variant="link" className="p-0 h-auto">Lire le guide</Button>
                  </div>
                  
                  <div className="rounded-lg border p-4 hover:bg-accent transition-colors">
                    <h3 className="font-medium mb-2">Fonctionnalités du journal</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Découvrez comment tirer le meilleur parti de votre journal émotionnel.
                    </p>
                    <Button variant="link" className="p-0 h-auto">Lire le guide</Button>
                  </div>
                  
                  <div className="rounded-lg border p-4 hover:bg-accent transition-colors">
                    <h3 className="font-medium mb-2">Graphiques et analyses</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Comprendre les graphiques et suivre votre évolution émotionnelle.
                    </p>
                    <Button variant="link" className="p-0 h-auto">Lire le guide</Button>
                  </div>
                  
                  <div className="rounded-lg border p-4 hover:bg-accent transition-colors">
                    <h3 className="font-medium mb-2">Paramètres de confidentialité</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tout sur la protection de vos données et les options de confidentialité.
                    </p>
                    <Button variant="link" className="p-0 h-auto">Lire le guide</Button>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline">Voir toute la documentation</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Shell>
  );
};

export default SupportPage;
