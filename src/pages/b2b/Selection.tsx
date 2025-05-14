
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Shell from '@/Shell';

export default function SelectionEntreprise() {
  const navigate = useNavigate();
  
  return (
    <Shell>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Bienvenue dans EmotionsCare Entreprise</h1>
          <p className="text-xl text-muted-foreground">Qui êtes-vous ?</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card className="shadow-md hover:shadow-lg transition-shadow border-blue-200 dark:border-blue-900">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle>Collaborateur</CardTitle>
              <CardDescription>
                Accédez à votre espace de bien-être personnel au travail
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                Suivi émotionnel, musicothérapie adaptée, coaching IA et scan émotionnel quotidien
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                onClick={() => navigate('/b2b/user/login')} 
                size="lg" 
                className="w-full"
              >
                Je suis un collaborateur
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow border-purple-200 dark:border-purple-900">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <CardTitle>RH / Manager</CardTitle>
              <CardDescription>
                Pilotez le bien-être émotionnel de vos équipes
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                Tableau de bord collectif, signaux faibles, organisation d'activités et analytics
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                onClick={() => navigate('/b2b/admin/login')} 
                variant="outline"
                size="lg"
                className="w-full border-purple-200 dark:border-purple-800"
              >
                Je suis RH ou manager
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </Shell>
  );
}
