
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageCircle, Book, Mail } from 'lucide-react';

const HelpPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Aide - EmotionsCare</title>
        <meta name="description" content="Centre d'aide EmotionsCare" />
      </Helmet>
      
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Centre d'aide</h1>
          <p className="text-gray-600">
            Trouvez des réponses à vos questions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Guide d'utilisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Apprenez à utiliser toutes les fonctionnalités d'EmotionsCare
              </p>
              <Button variant="outline" className="w-full">
                Voir le guide
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Questions fréquemment posées
              </p>
              <Button variant="outline" className="w-full">
                Voir la FAQ
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Discutez avec notre équipe support
              </p>
              <Button variant="outline" className="w-full">
                Démarrer le chat
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Contactez-nous par email
              </p>
              <Button variant="outline" className="w-full">
                Nous contacter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HelpPage;
