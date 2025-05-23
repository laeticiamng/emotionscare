
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, ArrowLeft, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-2">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Accès Professionnel EmotionsCare
            </CardTitle>
            <CardDescription className="text-lg">
              Choisissez votre type de compte professionnel
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto p-6 flex flex-col gap-4 border-2 hover:border-primary hover:bg-primary/5"
                  onClick={() => navigate('/b2b/user/login')}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">Collaborateur</h3>
                      <p className="text-sm text-muted-foreground">
                        Accédez à votre espace personnel de bien-être professionnel
                      </p>
                    </div>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto p-6 flex flex-col gap-4 border-2 hover:border-primary hover:bg-primary/5"
                  onClick={() => navigate('/b2b/admin/login')}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Shield className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">Administrateur</h3>
                      <p className="text-sm text-muted-foreground">
                        Gérez le bien-être de votre organisation et vos équipes
                      </p>
                    </div>
                  </div>
                </Button>
              </motion.div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-center">Fonctionnalités B2B EmotionsCare</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Analyse émotionnelle d'équipe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Tableaux de bord administrateur</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Outils de bien-être collaboratif</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Rapports et analytiques</span>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Pas encore de compte ? Contactez votre administrateur ou{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/b2b/user/register')}>
                  créez un compte collaborateur
                </Button>
              </p>
              
              <Button 
                variant="ghost" 
                onClick={() => navigate('/choose-mode')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la sélection de mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BSelectionPage;
