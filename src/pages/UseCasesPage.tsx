// @ts-nocheck
/**
 * UseCasesPage — Cas d'usage EmotionsCare
 * Page SEO non-brand ciblant les requêtes métier soignants
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePageSEO } from '@/hooks/usePageSEO';
import {
  Stethoscope,
  Moon,
  GraduationCap,
  Building2,
  Clock,
  Heart,
  ArrowRight,
  Shield,
  Brain,
} from 'lucide-react';

const USE_CASES = [
  {
    id: 'etudiant-ifsi',
    icon: GraduationCap,
    title: 'Étudiant en IFSI ou en médecine',
    subtitle: 'Gérer le stress des stages et des examens',
    problem: 'Près de 60% des étudiants en santé présentent des symptômes d\'anxiété. Les stages hospitaliers, les gardes et la charge de travail académique créent un stress chronique difficile à gérer.',
    solution: 'EmotionsCare propose des protocoles de régulation de 2 à 5 minutes utilisables entre deux cours ou pendant une pause de stage. Le scan émotionnel permet d\'identifier rapidement son état et d\'agir avant que le stress ne s\'installe.',
    features: ['Scan émotionnel rapide', 'Respiration guidée 2 min', 'Coach IA disponible 24/7', 'Journal émotionnel'],
    quote: 'Utilisable entre deux cours, dans le couloir de l\'hôpital ou avant un examen.',
  },
  {
    id: 'infirmiere-nuit',
    icon: Moon,
    title: 'Infirmier·ère de nuit',
    subtitle: 'Décompresser pendant les gardes',
    problem: 'Le travail de nuit perturbe les rythmes circadiens et augmente la charge émotionnelle. Les moments de pause sont rares et courts, rendant la récupération difficile.',
    solution: 'Les protocoles EmotionsCare sont conçus pour fonctionner en 2-5 minutes, avec ou sans écouteurs. La musicothérapie adaptative et la respiration guidée aident à réguler le système nerveux même en environnement bruyant.',
    features: ['Musicothérapie adaptative', 'Protocoles sans écouteurs', 'Mode sombre', 'Respiration polyvagale'],
    quote: 'Pas besoin de lieu calme. 3 minutes suffisent pour réguler votre système nerveux.',
  },
  {
    id: 'medecin-urgentiste',
    icon: Stethoscope,
    title: 'Médecin urgentiste',
    subtitle: 'Prévenir l\'épuisement professionnel',
    problem: 'Les urgentistes font face à des situations émotionnellement intenses quotidiennement. Le taux de burn-out dans cette spécialité dépasse 50%, avec des conséquences sur la qualité des soins.',
    solution: 'EmotionsCare permet de « décharger » rapidement entre deux patients. Le scan émotionnel identifie les signaux d\'alerte précoces et propose des interventions ciblées avant que l\'épuisement ne s\'installe.',
    features: ['Alertes de surcharge émotionnelle', 'Protocoles ultra-courts (2 min)', 'Suivi longitudinal', 'Recommandations personnalisées'],
    quote: 'Identifier les signaux d\'alerte avant le burn-out, pas après.',
  },
  {
    id: 'cadre-sante-rps',
    icon: Building2,
    title: 'Cadre de santé & RPS',
    subtitle: 'Piloter la prévention des risques psychosociaux',
    problem: 'Les cadres de santé doivent prévenir les RPS dans leurs équipes mais manquent d\'outils concrets. Les questionnaires annuels sont insuffisants et souvent ignorés.',
    solution: 'L\'offre B2B d\'EmotionsCare fournit un tableau de bord anonymisé permettant de suivre les indicateurs de bien-être collectif. Les données individuelles restent strictement privées, seules les tendances agrégées sont accessibles.',
    features: ['Dashboard RH anonymisé', 'Indicateurs bien-être agrégés', 'Rapports mensuels', 'Déploiement en 24h'],
    quote: 'Zéro donnée individuelle visible. Uniquement des tendances d\'équipe.',
  },
];

export default function UseCasesPage() {
  usePageSEO({
    title: 'Cas d\'usage — Comment les soignants utilisent EmotionsCare',
    description: 'Découvrez comment les étudiants en IFSI, infirmiers de nuit, médecins urgentistes et cadres de santé utilisent EmotionsCare pour réguler leur stress en 2-5 minutes.',
    keywords: 'cas d\'usage, gestion stress infirmier, burn-out médecin, prévention RPS soignants, étudiant IFSI stress, régulation émotionnelle hôpital',
    canonical: 'https://emotionscare.com/use-cases',
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Cas d'usage : comment les soignants utilisent EmotionsCare
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des protocoles de régulation émotionnelle de 2 à 5 minutes,
            conçus pour s'intégrer dans le rythme hospitalier sans perturber l'activité de soin.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" /> 2-5 min par session
            </span>
            <span className="flex items-center gap-1">
              <Brain className="h-4 w-4" aria-hidden="true" /> Basé sur les neurosciences
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4" aria-hidden="true" /> RGPD
            </span>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-16">
        <div className="container max-w-5xl mx-auto px-4 space-y-12">
          {USE_CASES.map((useCase, index) => (
            <Card key={useCase.id} className="overflow-hidden border-border/50">
              <CardContent className="p-0">
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Content */}
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <useCase.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{useCase.title}</h2>
                        <p className="text-sm text-muted-foreground">{useCase.subtitle}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm mb-1">Le problème</h3>
                        <p className="text-sm text-muted-foreground">{useCase.problem}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm mb-1">La solution EmotionsCare</h3>
                        <p className="text-sm text-muted-foreground">{useCase.solution}</p>
                      </div>
                    </div>
                  </div>

                  {/* Features sidebar */}
                  <div className="p-8 bg-muted/30 space-y-4 flex flex-col justify-center">
                    <h3 className="font-semibold text-foreground text-sm">Fonctionnalités clés</h3>
                    <ul className="space-y-2">
                      {useCase.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Heart className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <blockquote className="text-sm italic text-muted-foreground border-l-2 border-primary pl-3 mt-4">
                      {useCase.quote}
                    </blockquote>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Prêt·e à essayer ?
          </h2>
          <p className="text-muted-foreground">
            Commencez gratuitement. Aucune carte bancaire requise.
            Les protocoles essentiels sont accessibles dès l'inscription.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="rounded-full px-8 gap-2">
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Voir les tarifs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
