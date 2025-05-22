
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Support: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Votre message a été envoyé", {
      description: "Notre équipe vous répondra dans les plus brefs délais."
    });
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Assistance et support</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contactez-nous</CardTitle>
            <CardDescription>
              Notre équipe est disponible pour répondre à toutes vos questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nom</label>
                  <Input id="name" placeholder="Votre nom" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="email@example.com" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Sujet</label>
                <Input id="subject" placeholder="Sujet de votre message" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea id="message" placeholder="Décrivez votre problème ou votre question..." rows={5} required />
              </div>
              
              <Button type="submit" className="w-full">Envoyer</Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground">
              Vous pouvez également nous contacter par email à <span className="font-medium">support@emotionscare.com</span>
            </div>
          </CardFooter>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="link" className="text-left w-full justify-start px-0" onClick={() => navigate('/faq')}>
                Comment annuler mon abonnement ?
              </Button>
              <Button variant="link" className="text-left w-full justify-start px-0" onClick={() => navigate('/faq')}>
                Comment changer mon mot de passe ?
              </Button>
              <Button variant="link" className="text-left w-full justify-start px-0" onClick={() => navigate('/faq')}>
                Puis-je partager mon compte avec d'autres personnes ?
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ressources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="link" className="text-left w-full justify-start px-0" onClick={() => navigate('/guides')}>
                Guide de démarrage
              </Button>
              <Button variant="link" className="text-left w-full justify-start px-0" onClick={() => navigate('/tutorials')}>
                Tutoriels vidéo
              </Button>
              <Button variant="link" className="text-left w-full justify-start px-0" onClick={() => navigate('/pricing')}>
                Plans et tarifs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
