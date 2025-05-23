
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Shield, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const features = {
    user: [
      "Analyse émotionnelle personnalisée",
      "Outils de bien-être au travail",
      "Suivi de votre progression",
      "Accès à la communauté d'entreprise",
      "Ressources de développement personnel"
    ],
    admin: [
      "Tableau de bord analytique complet",
      "Gestion des équipes et départements",
      "Métriques de bien-être organisationnel",
      "Rapports et insights avancés",
      "Configuration des paramètres entreprise"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-6">
            <Building className="h-4 w-4" />
            Espace Professionnel
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Choisissez votre type d'accès
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            EmotionsCare s'adapte à votre rôle dans l'organisation pour vous offrir 
            l'expérience la plus pertinente
          </p>
        </motion.div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Collaborateur Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Collaborateur</CardTitle>
                <CardDescription className="text-base">
                  Accès individuel pour améliorer votre bien-être au travail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {features.user.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-4">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/b2b/user/login')}
                  >
                    Se connecter en tant que collaborateur
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/b2b/user/register')}
                  >
                    Créer un compte collaborateur
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Administrateur Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Administrateur</CardTitle>
                <CardDescription className="text-base">
                  Gestion et supervision du bien-être organisationnel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {features.admin.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-4">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/b2b/admin/login')}
                  >
                    Accès administrateur
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Accès réservé aux administrateurs autorisés
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold mb-4">
                Vous ne savez pas quel accès choisir ?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Si vous êtes un employé souhaitant utiliser EmotionsCare pour votre développement personnel, 
                choisissez <strong>Collaborateur</strong>. Si vous gérez une équipe ou souhaitez superviser 
                le bien-être organisationnel, choisissez <strong>Administrateur</strong>.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/choose-mode')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour à la sélection de mode
                </Button>
                <Button variant="ghost">
                  Contacter le support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
