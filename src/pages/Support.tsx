
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react';

const Support: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi d'un message
    setTimeout(() => {
      toast.success('Votre message a été envoyé', {
        description: 'Notre équipe vous répondra dans les plus brefs délais.'
      });
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };
  
  const faqItems = [
    {
      question: "Comment fonctionne la période d'essai gratuit ?",
      answer: "Vous bénéficiez de 5 jours d'essai gratuit sans engagement. Vous pouvez annuler à tout moment pendant cette période sans être facturé."
    },
    {
      question: "Comment mes données sont-elles protégées ?",
      answer: "Nous attachons la plus grande importance à la confidentialité de vos données. Toutes les informations sont chiffrées et stockées de manière sécurisée. Nous ne partageons jamais vos données personnelles avec des tiers."
    },
    {
      question: "Puis-je changer de formule ?",
      answer: "Oui, vous pouvez passer d'une formule à l'autre à tout moment. Le changement prendra effet à votre prochaine période de facturation."
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Support & Assistance</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Pour toute question, écrivez-nous à :
                </p>
                <p className="font-medium mt-2">support@emotionscare.com</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" onClick={() => window.location.href = 'mailto:support@emotionscare.com'}>
                  Envoyer un email
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Téléphone</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Du lundi au vendredi, de 9h à 18h :
                </p>
                <p className="font-medium mt-2">+33 (0)1 23 45 67 89</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" onClick={() => window.location.href = 'tel:+33123456789'}>
                  Appeler
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Chat en direct</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Discutez avec un conseiller en ligne :
                </p>
                <p className="font-medium mt-2">Disponible 7j/7, 9h-22h</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">
                  Démarrer un chat
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <HelpCircle className="h-6 w-6 mr-2 text-primary" />
              Questions fréquentes
            </h2>
            
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="font-medium text-lg mb-2">{item.question}</h3>
                  <p className="text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={() => window.open('/faq', '_blank')}
              >
                Voir toutes les questions fréquentes
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Contactez-nous</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        rows={5} 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Support;
