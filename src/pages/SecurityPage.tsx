/**
 * SecurityPage — Sécurité & confidentialité EmotionsCare
 * Page trust signal pour SEO et GEO
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageSEO } from '@/hooks/usePageSEO';
import {
  Shield,
  Lock,
  Eye,
  Server,
  FileCheck,
  Users,
  Trash2,
  Download,
  ArrowRight,
} from 'lucide-react';

const SECURITY_SECTIONS = [
  {
    icon: Shield,
    title: 'Conformité RGPD',
    content: 'EmotionsCare est conforme au Règlement Général sur la Protection des Données (RGPD). Nous traitons les données personnelles uniquement sur la base du consentement explicite ou de l\'exécution du contrat. Le Délégué à la Protection des Données (DPO) peut être contacté à dpo@emotionscare.com.',
  },
  {
    icon: Lock,
    title: 'Chiffrement des données',
    content: 'Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Les mots de passe sont hachés avec bcrypt. Les tokens d\'authentification utilisent JWT avec rotation automatique.',
  },
  {
    icon: Eye,
    title: 'Analyse faciale locale',
    content: 'Le scan émotionnel par IA s\'exécute entièrement sur votre appareil (edge computing). Aucune image, vidéo ou donnée biométrique n\'est transmise à nos serveurs ni stockée. Seul le résultat anonymisé de l\'analyse est enregistré.',
  },
  {
    icon: Server,
    title: 'Hébergement',
    content: 'Les données sont hébergées sur des serveurs situés dans l\'Union Européenne via Supabase (infrastructure AWS eu-west). Nos sous-traitants techniques sont documentés conformément à l\'article 28 du RGPD.',
  },
  {
    icon: Users,
    title: 'Mode B2B & confidentialité',
    content: 'En mode entreprise, les établissements de santé n\'ont accès qu\'à des statistiques agrégées et anonymisées. Aucune donnée individuelle (scans, journaux, émotions) n\'est visible par l\'employeur. L\'anonymisation est irréversible.',
  },
  {
    icon: FileCheck,
    title: 'Politique de rétention',
    content: 'Les données émotionnelles sont conservées 24 mois après la dernière activité. Les données de compte sont supprimées dans les 30 jours suivant la demande. Les logs techniques sont purgés après 90 jours.',
  },
];

const USER_RIGHTS = [
  { icon: Eye, title: 'Droit d\'accès', description: 'Consultez toutes les données que nous détenons sur vous depuis les paramètres de votre compte.' },
  { icon: Download, title: 'Droit à la portabilité', description: 'Exportez l\'intégralité de vos données aux formats JSON ou CSV depuis Paramètres > Données.' },
  { icon: Trash2, title: 'Droit à l\'effacement', description: 'Demandez la suppression complète de vos données. Traitement sous 72 heures, suppression irréversible.' },
  { icon: FileCheck, title: 'Droit de rectification', description: 'Modifiez vos informations personnelles à tout moment depuis votre profil.' },
];

export default function SecurityPage() {
  usePageSEO({
    title: 'Sécurité & Confidentialité — EmotionsCare',
    description: 'Découvrez comment EmotionsCare protège vos données : chiffrement AES-256, conformité RGPD, analyse faciale locale, hébergement EU. Vos données de santé sont notre priorité.',
    keywords: 'sécurité données santé, RGPD, confidentialité, chiffrement, données soignants, protection données médicales, EmotionsCare',
    canonical: 'https://emotionscare.com/security',
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium">
            <Shield className="h-4 w-4" aria-hidden="true" />
            Sécurité & Confidentialité
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Vos données de santé sont notre priorité
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            EmotionsCare applique les standards les plus élevés de protection des données.
            Chiffrement de bout en bout, conformité RGPD, et analyse faciale entièrement locale.
          </p>
        </div>
      </section>

      {/* Security sections */}
      <section className="py-16">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SECURITY_SECTIONS.map((section) => (
              <Card key={section.title} className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <section.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User rights */}
      <section className="py-16 bg-muted/30" aria-labelledby="user-rights-heading">
        <div className="container max-w-5xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-3">
            <h2 id="user-rights-heading" className="text-2xl font-bold text-foreground">
              Vos droits sur vos données
            </h2>
            <p className="text-muted-foreground">
              Conformément au RGPD, vous disposez de droits étendus sur vos données personnelles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {USER_RIGHTS.map((right) => (
              <div key={right.title} className="bg-background rounded-xl p-5 border border-border/50 space-y-3">
                <right.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="font-semibold text-foreground">{right.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{right.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="py-16" aria-labelledby="limits-heading">
        <div className="container max-w-3xl mx-auto px-4 space-y-6">
          <h2 id="limits-heading" className="text-2xl font-bold text-foreground text-center">
            Transparence sur nos limites
          </h2>
          <div className="bg-muted/30 rounded-2xl p-8 space-y-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">EmotionsCare n'est pas un dispositif médical.</strong>{' '}
              Notre plateforme est un outil de prévention et de bien-être émotionnel. Elle ne pose aucun diagnostic
              et ne remplace pas un suivi médical, psychologique ou psychiatrique.
            </p>
            <p>
              <strong className="text-foreground">Certification HDS en cours d'étude.</strong>{' '}
              Nous travaillons à l'obtention de la certification Hébergement de Données de Santé (HDS).
              Nos données sont actuellement hébergées sur des serveurs conformes aux standards européens.
            </p>
            <p>
              <strong className="text-foreground">Sous-traitants techniques.</strong>{' '}
              Nous utilisons Supabase (hébergement, authentification), OpenAI (coach IA — aucune donnée de santé transmise)
              et Stripe (paiements). La liste complète de nos sous-traitants est disponible sur demande.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Des questions sur la sécurité ?
          </h2>
          <p className="text-muted-foreground">
            Notre équipe est disponible pour répondre à vos questions sur la protection de vos données.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="rounded-full px-8 gap-2">
                Nous contacter
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/legal/privacy">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Politique de confidentialité
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
