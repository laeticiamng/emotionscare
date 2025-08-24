
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const SocialPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/b2c/dashboard')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-rose-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Communauté Bien-être
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Partagez, soutenez et grandissez ensemble
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fil d'actualité de la communauté</CardTitle>
                <CardDescription>Dernières nouvelles et encouragements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <p className="font-medium">Marie L.</p>
                  <p className="text-sm text-muted-foreground">
                    Excellente session de méditation ce matin ! 🧘‍♀️ La technique de respiration a vraiment fonctionné.
                  </p>
                  <span className="text-xs text-muted-foreground">il y a 2h • 12 ❤️</span>
                </div>
                <div className="border-l-4 border-secondary pl-4 py-2">
                  <p className="font-medium">Thomas K.</p>
                  <p className="text-sm text-muted-foreground">
                    Jour 15 de mon défi bien-être ! Merci pour vos encouragements 💪
                  </p>
                  <span className="text-xs text-muted-foreground">il y a 4h • 18 ❤️</span>
                </div>
                <div className="border-l-4 border-accent pl-4 py-2">
                  <p className="font-medium">Sophie R.</p>
                  <p className="text-sm text-muted-foreground">
                    Des conseils pour gérer le stress au travail ? Je ressens beaucoup de pression...
                  </p>
                  <span className="text-xs text-muted-foreground">il y a 6h • 12 commentaires</span>
                </div>
                <Button className="w-full">Partager votre expérience</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Groupes de soutien</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>🧘 Méditation quotidienne</span>
                    <Button variant="outline" size="sm">Rejoindre</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>💪 Motivation & objectifs</span>
                    <Button variant="outline" size="sm">Rejoindre</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>🧠 Gestion du stress</span>
                    <Button variant="outline" size="sm">Membre</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Défis communautaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="font-medium">30 jours de gratitude</p>
                    <p className="text-xs text-muted-foreground">234 participants</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <p className="font-medium">Méditation collective</p>
                    <p className="text-xs text-muted-foreground">156 participants</p>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    Voir tous les défis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SocialPage;
