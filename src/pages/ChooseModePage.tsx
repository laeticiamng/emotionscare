
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Users, Building, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-8 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Choisissez votre mode d'accès
            </h1>
            <p className="text-xl text-gray-600">
              Sélectionnez l'option qui correspond le mieux à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-800 mb-4">
                    Particulier (B2C)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="space-y-3">
                    <p className="text-gray-700 text-lg">
                      Accès individuel pour votre bien-être personnel
                    </p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Analyse émotionnelle personnalisée</li>
                      <li>• Coach IA disponible 24/7</li>
                      <li>• Musique thérapeutique adaptée</li>
                      <li>• Journal émotionnel privé</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => navigate('/b2c/login')}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl text-lg"
                  >
                    Accès Particulier
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Building className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-purple-800 mb-4">
                    Entreprise (B2B)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="space-y-3">
                    <p className="text-gray-700 text-lg">
                      Solution complète pour les organisations
                    </p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Tableau de bord RH avancé</li>
                      <li>• Analytics d'équipe en temps réel</li>
                      <li>• Gestion des utilisateurs</li>
                      <li>• Rapports de bien-être collectif</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => navigate('/b2b/selection')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl text-lg"
                  >
                    Accès Entreprise
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
