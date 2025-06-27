
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, BarChart3, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: 'Analytics RH Avancés',
      description: 'Tableau de bord complet pour suivre le bien-être de vos équipes'
    },
    {
      icon: Users,
      title: 'Gestion d\'Équipes',
      description: 'Outils collaboratifs pour managers et responsables RH'
    },
    {
      icon: Shield,
      title: 'Sécurité Entreprise',
      description: 'Conformité RGPD, chiffrement, et audit de sécurité'
    }
  ];

  const plans = [
    {
      name: 'Équipe',
      price: '29€',
      period: '/mois/utilisateur',
      description: 'Pour les petites équipes (5-20 personnes)',
      features: [
        'Dashboard basique',
        'Analyses individuelles',
        'Support email',
        'Intégrations limitées'
      ]
    },
    {
      name: 'Entreprise',
      price: '49€',
      period: '/mois/utilisateur',
      description: 'Pour les moyennes entreprises (20-200 personnes)',
      features: [
        'Dashboard avancé',
        'Analytics prédictifs',
        'Support prioritaire',
        'Toutes les intégrations',
        'Formation équipe'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Sur mesure',
      period: '',
      description: 'Pour les grandes entreprises (200+ personnes)',
      features: [
        'Solution personnalisée',
        'Déploiement sur site',
        'Support dédié 24/7',
        'Intégrations custom',
        'Consultant bien-être'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EmotionsCare pour Entreprises
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transformez le bien-être au travail avec une plateforme IA qui prend soin de vos équipes
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/b2b/selection')}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Commencer Maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Demander une Démo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi Choisir EmotionsCare B2B ?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center">
              <CardHeader>
                <feature.icon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Choisissez Votre Plan
        </h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Plus Populaire
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-blue-600">
                  {plan.price}
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => navigate('/b2b/selection')}
                >
                  {plan.name === 'Enterprise' ? 'Nous Contacter' : 'Commencer'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Transformer Votre Entreprise ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez plus de 500 entreprises qui font confiance à EmotionsCare
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/b2b/selection')}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Démarrer Maintenant
          </Button>
        </div>
      </section>
    </div>
  );
};

export default B2BPage;
