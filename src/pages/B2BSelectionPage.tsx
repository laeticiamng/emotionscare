
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, BarChart3, Shield, ArrowRight, Star, CheckCircle, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const B2BSelectionPage = () => {
  const userFeatures = [
    "Accès aux modules de bien-être",
    "Coach IA personnel",
    "Suivi des progrès",
    "Communauté d'entreprise"
  ];

  const adminFeatures = [
    "Tableau de bord RH avancé",
    "Analytics d'équipe",
    "Gestion des utilisateurs",
    "Rapports détaillés",
    "Configuration d'entreprise"
  ];

  const benefits = [
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
      title: "Productivité +25%",
      description: "Amélioration mesurée de la performance"
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Engagement +40%",
      description: "Employees plus motivés et impliqués"
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-500" />,
      title: "Absentéisme -30%",
      description: "Réduction significative des arrêts"
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <Building2 className="h-4 w-4 mr-2" />
            Espace Entreprise
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transformez le bien-être de vos équipes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choisissez votre niveau d'accès pour optimiser la santé mentale et la performance de votre organisation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Utilisateur</CardTitle>
                <CardDescription>Pour les employés et managers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {userFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link to="/b2b/user/login">
                    Accès Utilisateur
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full border-2 border-purple-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Recommandé
                </Badge>
              </div>
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Administrateur</CardTitle>
                <CardDescription>Pour les RH et dirigeants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {adminFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                  <Link to="/b2b/admin/login">
                    Accès Administrateur
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-center">Résultats Prouvés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{benefit.title}</h4>
                      <p className="text-xs text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    "Solution exceptionnelle pour améliorer le bien-être en entreprise"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">- DRH, Fortune 500</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-4">Besoin d'aide pour choisir ?</h3>
            <p className="mb-6 max-w-md">
              Notre équipe peut vous accompagner pour déterminer la solution la plus adaptée à votre organisation.
            </p>
            <Button size="lg" variant="secondary">
              Demander une démo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
