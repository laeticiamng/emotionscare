
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-gray-800">
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
              <Settings className="h-12 w-12 text-slate-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
              Paramètres
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Personnalisez votre expérience bien-être
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences</CardTitle>
                  <CardDescription>Personnalisez vos paramètres</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Notifications push</span>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Thème d'interface</span>
                    <Button variant="outline" size="sm">Changer</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Langue</span>
                    <Button variant="outline" size="sm">Français</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Confidentialité</CardTitle>
                  <CardDescription>Gérez vos données personnelles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Données personnelles</span>
                    <Button variant="outline" size="sm">Voir</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Partage anonyme</span>
                    <Button variant="outline" size="sm">Activé</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Export de données</span>
                    <Button variant="outline" size="sm">Télécharger</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
