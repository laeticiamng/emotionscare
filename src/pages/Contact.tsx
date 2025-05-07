
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AtSign, MapPin, Phone } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center mb-2">Contactez-nous</h1>
      <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Notre équipe est à votre disposition pour répondre à toutes vos questions.
      </p>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Formulaire de contact */}
        <div className="card-premium p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
          
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nom</label>
                <Input id="name" placeholder="Votre nom" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="votre@email.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Sujet</label>
              <Input id="subject" placeholder="Objet de votre message" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <Textarea id="message" placeholder="Votre message..." rows={5} />
            </div>
            
            <Button type="submit" className="w-full">Envoyer le message</Button>
          </form>
        </div>
        
        {/* Informations de contact */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Adresse</h3>
                  <p className="text-muted-foreground">Siège social</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Téléphone</h3>
                  <p className="text-muted-foreground">Contactez-nous par téléphone</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <AtSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">contact@emotionscare.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-premium p-6 bg-primary/5">
            <h3 className="font-medium mb-2">Heures d'ouverture</h3>
            <p className="text-muted-foreground">Lundi - Vendredi: 9h00 - 18h00</p>
            <p className="text-muted-foreground">Samedi - Dimanche: Fermé</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
