/**
 * 💰 PAGE TARIFICATION
 * Plans et tarifs pour EmotionsCare
 */

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Brain, 
  Music, 
  Sparkles,
  Building2
} from 'lucide-react';

interface PricingPageProps {
  'data-testid'?: string;
}

const PLANS = [
  {
    id: 'free',
    name: 'Gratuit',
    price: '0€',
    period: '/mois',
    description: 'Parfait pour découvrir EmotionsCare',
    icon: Sparkles,
    features: [
      '3 analyses émotionnelles/jour',
      '3 générations musicales/jour',
      'Journal personnel basique',
      'Exercices de respiration',
      'Support communautaire'
    ],
    limitations: [
      'Analyses limitées',
      'Pas de sauvegarde cloud',
      'Fonctionnalités VR non incluses'
    ],
    cta: 'Commencer Gratuitement',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '19€',
    period: '/mois',
    description: 'Pour un usage personnel optimal',
    icon: Star,
    features: [
      'Analyses émotionnelles illimitées',
      '100 générations musicales/mois',
      'Journal IA avancé avec insights',
      'Toutes les activités bien-être',
      'Thérapie musicale personnalisée',
      'Sauvegarde cloud sécurisée',
      'Statistiques détaillées',
      'Support prioritaire'
    ],
    limitations: [],
    cta: 'Choisir Pro',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '39€',
    period: '/mois',
    description: 'L\'expérience complète avec VR',
    icon: Crown,
    features: [
      'Tout du plan Pro',
      'Génération musicale illimitée',
      'Accès VR complet',
      'Séances VR Galaxy immersives',
      'Coach IA personnel avancé',
      'Intégration capteurs biométriques',
      'API développeur incluse',
      'Support téléphonique 24/7'
    ],
    limitations: [],
    cta: 'Choisir Premium',
    popular: false
  },
  {
    id: 'enterprise',
    name: 'Entreprise',
    price: 'Sur devis',
    period: '',
    description: 'Solutions sur mesure pour organisations',
    icon: Building2,
    features: [
      'Toutes les fonctionnalités Premium',
      'Dashboard manager complet',
      'Analytics équipe avancées',
      'Intégration SIRH',
      'Formations personnalisées',
      'Support technique dédié',
      'Conformité RGPD avancée',
      'SLA garanti'
    ],
    limitations: [],
    cta: 'Nous Contacter',
    popular: false
  }
];

export default function PricingPage({ 'data-testid': testId }: PricingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5" data-testid={testId}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Choisissez Votre Plan
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Des solutions adaptées à tous vos besoins de bien-être émotionnel
            </p>
            
            <div className="flex justify-center items-center gap-4 mb-8">
              <Badge variant="outline" className="text-sm">
                <Brain className="w-4 h-4 mr-1" />
                Analyse IA Hume + OpenAI
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Music className="w-4 h-4 mr-1" />
                Musique Suno Premium
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Zap className="w-4 h-4 mr-1" />
                Support 24/7
              </Badge>
            </div>
          </div>

          {/* Grille des plans */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card 
                  key={plan.id}
                  className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Plus Populaire
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-full ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10'}`}>
                        <Icon className={`w-6 h-6 ${plan.popular ? '' : 'text-primary'}`} />
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-2 opacity-60">
                          <span className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0">×</span>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparaison des fonctionnalités */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">
              Comparaison Détaillée
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-card rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Fonctionnalités</th>
                    <th className="text-center p-4 font-medium">Gratuit</th>
                    <th className="text-center p-4 font-medium">Pro</th>
                    <th className="text-center p-4 font-medium">Premium</th>
                    <th className="text-center p-4 font-medium">Entreprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Analyses émotionnelles', '3/jour', '∞', '∞', '∞'],
                    ['Génération musicale', '3/jour', '100/mois', '∞', '∞'],
                    ['Réalité virtuelle', '×', '×', '✓', '✓'],
                    ['Coach IA avancé', '×', '✓', '✓', '✓'],
                    ['API développeur', '×', '×', '✓', '✓'],
                    ['Support prioritaire', '×', '✓', '✓', '✓'],
                    ['Dashboard manager', '×', '×', '×', '✓']
                  ].map(([feature, ...values], index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4 font-medium">{feature}</td>
                      {values.map((value, i) => (
                        <td key={i} className="p-4 text-center">
                          {value === '✓' ? (
                            <Check className="w-4 h-4 text-green-500 mx-auto" />
                          ) : value === '×' ? (
                            <span className="text-muted-foreground">×</span>
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Rapide */}
          <div className="text-center p-8 bg-primary/5 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Questions Fréquentes</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
              {[
                {
                  q: 'Puis-je changer de plan à tout moment ?',
                  a: 'Oui, vous pouvez upgrader ou downgrader votre plan quand vous le souhaitez.'
                },
                {
                  q: 'Y a-t-il une période d\'essai gratuite ?',
                  a: 'Tous les plans payants incluent 14 jours d\'essai gratuit, sans engagement.'
                },
                {
                  q: 'Mes données sont-elles sécurisées ?',
                  a: 'Toutes vos données sont chiffrées et stockées en conformité RGPD.'
                },
                {
                  q: 'Le support est-il inclus ?',
                  a: 'Oui, tous les plans incluent un support, avec des niveaux de priorité différents.'
                }
              ].map((faq, index) => (
                <div key={index}>
                  <h4 className="font-medium mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Button size="lg">
                Commencer Maintenant
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Essai gratuit de 14 jours • Aucune carte bancaire requise
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}