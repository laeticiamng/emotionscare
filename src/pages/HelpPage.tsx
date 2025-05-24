
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react';

const HelpPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Aide - EmotionsCare</title>
        <meta name="description" content="Centre d'aide et support EmotionsCare" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Centre d'aide</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Questions fréquentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Comment utiliser le scanner émotionnel ?</h3>
                  <p className="text-gray-600">Le scanner analyse vos émotions via texte ou voix...</p>
                </div>
                <div>
                  <h3 className="font-semibold">Comment fonctionne le coach IA ?</h3>
                  <p className="text-gray-600">Notre coach utilise l'intelligence artificielle...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Nous contacter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@emotionscare.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+33 1 23 45 67 89</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HelpPage;
