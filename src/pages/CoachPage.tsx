
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, User, BookOpen, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoachPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <MessageCircle className="h-10 w-10 text-green-500" />
            Coach Virtuel
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Votre accompagnateur personnel pour le bien-être émotionnel
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Coach Personnel
              </CardTitle>
              <CardDescription>
                Discussion privée avec votre coach IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Parlez librement de vos préoccupations et recevez des conseils personnalisés
                pour améliorer votre bien-être au travail.
              </p>
              <Button className="w-full">Commencer une conversation</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Programmes d'accompagnement
              </CardTitle>
              <CardDescription>
                Programmes structurés pour votre développement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Gestion du stress</h4>
                  <p className="text-sm text-gray-600">Programme de 7 jours</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Confiance en soi</h4>
                  <p className="text-sm text-gray-600">Programme de 14 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="ghost">← Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
