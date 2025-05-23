
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, ArrowRight, ArrowLeft } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            Espace Entreprise
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Choisissez votre rôle pour accéder à l'interface adaptée à vos besoins professionnels.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Collaborateur</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Accédez à votre espace personnel de bien-être au travail. 
                  Bénéficiez d'un accompagnement adapté à votre environnement professionnel.
                </p>
                <ul className="text-left space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Scanner émotionnel en entreprise</li>
                  <li>• Coach professionnel</li>
                  <li>• Modules de team building</li>
                  <li>• Suivi personnalisé</li>
                </ul>
                <Button 
                  className="w-full group" 
                  onClick={() => navigate('/b2b/user/login')}
                >
                  Accès Collaborateur
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-slate-200">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-10 w-10 text-slate-600" />
                </div>
                <CardTitle className="text-2xl">Administration</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Interface de gestion pour les RH et managers. 
                  Analysez et pilotez le bien-être de vos équipes.
                </p>
                <ul className="text-left space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Tableau de bord global</li>
                  <li>• Analyses d'équipe</li>
                  <li>• Gestion des utilisateurs</li>
                  <li>• Rapports détaillés</li>
                </ul>
                <Button 
                  className="w-full group bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600" 
                  onClick={() => navigate('/b2b/admin/login')}
                >
                  Accès Administration
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-16"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/choose-mode')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au choix du mode
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
