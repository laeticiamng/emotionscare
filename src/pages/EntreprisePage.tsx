/**
 * EntreprisePage - Solution B2B pour les entreprises
 * 100% accessible avec fonctionnalités avancées
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  BarChart3, 
  Shield, 
  Brain, 
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Calendar,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Solution {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  price?: string;
  popular?: boolean;
  color: string;
}

const solutions: Solution[] = [
  {
    title: 'Bien-être Équipe',
    description: 'Outils personnalisés pour le bien-être de vos collaborateurs',
    icon: Users,
    color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    price: '€15/utilisateur/mois',
    features: [
      'Coach IA pour chaque employé',
      'Analyses émotionnelles d\'équipe',
      'Programmes de respiration collectifs',
      'Dashboard manager en temps réel',
      'Support 24/7'
    ]
  },
  {
    title: 'Analytics RH',
    description: 'Insights data-driven pour optimiser la performance',
    icon: BarChart3,
    color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    price: '€25/utilisateur/mois',
    popular: true,
    features: [
      'Métriques de bien-être avancées',
      'Prédictions de burn-out',
      'ROI des programmes bien-être',
      'Rapports personnalisables',
      'API et intégrations',
      'Formation certifiée'
    ]
  },
  {
    title: 'Enterprise+',
    description: 'Solution complète sur-mesure pour grandes organisations',
    icon: Building2,
    color: 'bg-gold-500/10 text-gold-600 border-gold-200',
    price: 'Sur mesure',
    features: [
      'Déploiement on-premise/cloud',
      'IA personnalisée à votre secteur',
      'Intégration complète SIRH',
      'Support dédié 24/7/365',
      'Conformité maximale (RGPD+)',
      'Formations sur site'
    ]
  }
];

const benefits = [
  { metric: '47%', label: 'Réduction du stress', icon: TrendingUp },
  { metric: '23%', label: 'Augmentation productivité', icon: Target },
  { metric: '65%', label: 'Satisfaction employés', icon: Trophy },
  { metric: '38%', label: 'Réduction turnover', icon: CheckCircle }
];

const caseStudies = [
  {
    company: 'TechCorp 500+',
    industry: 'Technologie',
    employees: '2,000+',
    results: '40% réduction burn-out en 6 mois',
    testimonial: 'EmotionsCare a révolutionné notre approche du bien-être au travail.'
  },
  {
    company: 'HealthGroup',
    industry: 'Santé',
    employees: '850',
    results: '60% amélioration engagement',
    testimonial: 'Des résultats mesurables sur le moral et la performance de nos équipes.'
  },
  {
    company: 'Finance Pro',
    industry: 'Finance',
    employees: '1,200',
    results: '25% réduction absentéisme',
    testimonial: 'Un investissement qui se rentabilise rapidement en productivité.'
  }
];

export default function EntreprisePage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [_selectedSolution, setSelectedSolution] = useState(1);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
      >
        Aller au contenu principal
      </a>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto max-w-6xl" id="main-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 px-4 py-2" variant="outline">
              <Building2 className="w-4 h-4 mr-2" />
              Trusted by 500+ Enterprises
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Transformez le Bien-être
              <br />
              <span className="text-foreground">de vos Équipes</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Augmentez la productivité, réduisez le turnover et créez une culture d'entreprise 
              positive avec notre plateforme IA de bien-être émotionnel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => navigate('/signup')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Réserver une Démo
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => navigate('/pricing')}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Voir les Tarifs
              </Button>
            </div>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-20"
          >
            {benefits.map((benefit, _index) => (
              <div key={benefit.label} className="space-y-2">
                <div className="flex justify-center mb-3">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">{benefit.metric}</div>
                <div className="text-muted-foreground text-sm">{benefit.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Solutions Adaptées à vos Besoins
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des packages flexibles pour accompagner votre croissance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card 
                  className={`h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 relative ${
                    solution.popular ? 'ring-2 ring-primary shadow-xl' : ''
                  }`}
                  onClick={() => setSelectedSolution(index)}
                >
                  {solution.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                      Plus Populaire
                    </Badge>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className={`p-4 rounded-lg ${solution.color} w-fit`}>
                      <solution.icon className="w-8 h-8" />
                    </div>
                    
                    <CardTitle className="text-2xl">{solution.title}</CardTitle>
                    <CardDescription className="text-base">
                      {solution.description}
                    </CardDescription>
                    
                    <div className="text-3xl font-bold text-primary mt-4">
                      {solution.price}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button className="w-full" variant={solution.popular ? "default" : "outline"}>
                      Commencer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground">
              Nos clients obtiennent des résultats concrets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">{study.industry}</Badge>
                      <span className="text-sm text-muted-foreground">{study.employees} employés</span>
                    </div>
                    <CardTitle className="text-xl">{study.company}</CardTitle>
                    <CardDescription className="text-lg font-semibold text-green-600">
                      {study.results}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="italic text-muted-foreground">
                      "{study.testimonial}"
                    </blockquote>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Pourquoi Choisir EmotionsCare ?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Sécurité Enterprise</CardTitle>
                <CardDescription>
                  Conformité RGPD, chiffrement bout-en-bout, audits sécurité réguliers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="w-12 h-12 text-primary mb-4" />
                <CardTitle>IA Avancée</CardTitle>
                <CardDescription>
                  Algorithmes propriétaires adaptés aux spécificités de votre secteur
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Déploiement Global</CardTitle>
                <CardDescription>
                  Support multi-langues, conformité internationale, infrastructure mondiale
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Support Premium</CardTitle>
                <CardDescription>
                  Account manager dédié, formation certifiée, support 24/7
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <CardTitle>ROI Prouvé</CardTitle>
                <CardDescription>
                  Retour sur investissement moyen de 340% en 12 mois
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Déploiement Rapide</CardTitle>
                <CardDescription>
                  Mise en place en moins de 2 semaines, adoption utilisateur garantie
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Prêt à Révolutionner votre Entreprise ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Réservez une démo personnalisée et découvrez comment EmotionsCare peut 
              transformer le bien-être de vos équipes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => navigate('/signup')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Réserver une Démo
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Nous Appeler
              </Button>
            </div>

            <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                enterprise@emotionscare.com
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +33 1 23 45 67 89
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}