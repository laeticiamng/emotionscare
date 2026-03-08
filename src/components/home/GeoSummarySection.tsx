/**
 * GeoSummarySection - Bloc "En bref" optimisé pour les moteurs génératifs
 * Contenu factuel, structuré, citable par les IA
 * CTA vers signup ou dashboard selon l'état d'authentification
 */

import React from 'react';
import { Heart, Zap, Shield, Users, Clock, Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const GeoSummarySection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 bg-muted/30" aria-labelledby="geo-summary-heading">
      <div className="container max-w-5xl mx-auto px-4 space-y-12">
        {/* En bref */}
        <div className="text-center space-y-4">
          <h2 id="geo-summary-heading" className="text-3xl font-bold text-foreground">
            En bref
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            EmotionsCare est une plateforme française de régulation émotionnelle
            qui propose des exercices guidés de 2 à 5 minutes basés sur les neurosciences
            (cohérence cardiaque, théorie polyvagale), spécifiquement conçus pour
            les soignants et étudiants en santé confrontés au stress et au burn-out.
          </p>
        </div>

        {/* 3 piliers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3 p-6 rounded-2xl bg-background border border-border/50">
            <Users className="h-8 w-8 text-primary mx-auto" aria-hidden="true" />
            <h3 className="font-semibold text-foreground text-lg">Pour qui ?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Étudiants en médecine et IFSI, infirmiers, aides-soignants,
              médecins et tout professionnel de santé exposé au stress chronique.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 rounded-2xl bg-background border border-border/50">
            <Brain className="h-8 w-8 text-primary mx-auto" aria-hidden="true" />
            <h3 className="font-semibold text-foreground text-lg">Comment ça marche ?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Exercices guidés de 2 à 5 minutes : respiration, scan émotionnel,
              musicothérapie et coach IA disponible 24/7. Utilisable entre deux gardes.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 rounded-2xl bg-background border border-border/50">
            <Shield className="h-8 w-8 text-primary mx-auto" aria-hidden="true" />
            <h3 className="font-semibold text-foreground text-lg">Confiance & sécurité</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Conforme RGPD, données chiffrées, analyse faciale locale (aucune image stockée).
              Gratuit pour commencer, sans engagement.
            </p>
          </div>
        </div>

        {/* Différenciation */}
        <div className="bg-background border border-border/50 rounded-2xl p-8 space-y-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
            Ce qui nous différencie
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
              <span>Exercices de 2-5 min adaptés au rythme hospitalier (pas 20 min de méditation)</span>
            </li>
            <li className="flex items-start gap-2">
              <Heart className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
              <span>Conçu spécifiquement pour les soignants, pas une app de bien-être généraliste</span>
            </li>
            <li className="flex items-start gap-2">
              <Brain className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
              <span>Fondé sur la cohérence cardiaque et la théorie polyvagale</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
              <span>Mode Établissement avec tableau de bord pour responsables bien-être</span>
            </li>
          </ul>
        </div>

        {/* CTA de transition */}
        <div className="text-center space-y-2">
          <Link to={isAuthenticated ? '/app/home' : '/signup'}>
            <Button size="lg" className="rounded-full px-8 gap-2">
              {isAuthenticated ? 'Accéder à mon espace' : 'Essayer gratuitement'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          {!isAuthenticated && (
            <p className="text-xs text-muted-foreground">Aucune carte bancaire requise · Compte créé en 30 secondes</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default GeoSummarySection;
