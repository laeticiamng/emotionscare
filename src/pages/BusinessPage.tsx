
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Shield, BarChart, Brain, Heart, Users, Check } from 'lucide-react';
import Shell from '@/Shell';

const BusinessPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Shell>
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Solutions pour les entreprises</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Améliorez le bien-être émotionnel au sein de votre organisation et créez un environnement de travail plus sain et productif.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/b2b/selection')} className="px-8">
                Découvrir nos solutions
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')} className="px-8">
                Demander une démo
              </Button>
            </div>
          </div>
          
          {/* Key benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Les bénéfices pour votre entreprise</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Heart className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Amélioration du bien-être</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Des outils concrets pour améliorer le bien-être émotionnel de vos employés et réduire le stress professionnel.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <BarChart className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Augmentation de la productivité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Des collaborateurs épanouis sont plus engagés et plus productifs, ce qui se traduit par de meilleurs résultats.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Réduction du turnover</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Fidélisez vos talents en leur offrant un environnement de travail qui prend soin de leur santé mentale.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Features */}
          <div className="mb-16 bg-accent/30 py-16 px-4 rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-12">Nos fonctionnalités</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Analyse émotionnelle</h3>
                  <p className="text-muted-foreground">
                    Des outils d'analyse sophistiqués pour comprendre et suivre l'état émotionnel de vos équipes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Dashboard administrateur</h3>
                  <p className="text-muted-foreground">
                    Un tableau de bord complet pour les RH et managers avec des indicateurs clés sur le bien-être.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ressources personnalisées</h3>
                  <p className="text-muted-foreground">
                    Des contenus adaptés aux besoins spécifiques de chaque collaborateur.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Analyse organisationnelle</h3>
                  <p className="text-muted-foreground">
                    Identifiez les tendances et problématiques au niveau des équipes et départements.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pricing */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-4">Nos offres</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Des solutions adaptées à toutes les tailles d'entreprises, du démarrage à l'échelle.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-accent">
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <div className="text-3xl font-bold mt-2">29€<span className="text-sm text-muted-foreground font-normal"> /mois par utilisateur</span></div>
                  <CardDescription>Idéal pour les petites équipes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {['5-50 utilisateurs', 'Fonctionnalités de base', 'Support par email'].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline">Essai gratuit</Button>
                </CardContent>
              </Card>
              
              <Card className="border-primary relative">
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                    Le plus populaire
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Professional</CardTitle>
                  <div className="text-3xl font-bold mt-2">59€<span className="text-sm text-muted-foreground font-normal"> /mois par utilisateur</span></div>
                  <CardDescription>Pour les entreprises en croissance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {['50-250 utilisateurs', 'Fonctionnalités avancées', 'Dashboard administrateur', 'Support prioritaire'].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6">Essai gratuit</Button>
                </CardContent>
              </Card>
              
              <Card className="border-accent">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <div className="text-3xl font-bold mt-2">Contact<span className="text-sm text-muted-foreground font-normal"> pour tarifs</span></div>
                  <CardDescription>Solution sur mesure pour grandes organisations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {['Utilisateurs illimités', 'Personnalisation complète', 'Intégrations avancées', 'Support dédié'].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline">Contacter les ventes</Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center bg-primary text-primary-foreground p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Prêt à transformer la santé émotionnelle de votre organisation?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Rejoignez les entreprises qui placent le bien-être de leurs collaborateurs au cœur de leur stratégie.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" onClick={() => navigate('/b2b/selection')} className="px-8">
                Commencer maintenant
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10" onClick={() => navigate('/contact')}>
                Parler à un expert
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default BusinessPage;
