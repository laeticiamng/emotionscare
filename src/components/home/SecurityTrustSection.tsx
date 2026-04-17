// @ts-nocheck
/**
 * SecurityTrustSection — Section "Sécurité et confidentialité"
 *
 * Aucune certification, aucun chiffre, aucune mention légale non confirmée.
 * Seuls des engagements vérifiables et factuels apparaissent. Tout ajout
 * futur (ex: HDS, ISO 27001) doit être validé avant publication.
 */
import React from 'react';
import { Card } from '@/components/ui/card';
import { Lock, ShieldCheck, EyeOff, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const COMMITMENTS = [
  {
    icon: Lock,
    title: 'Chiffrement des données',
    description:
      'Vos données sont chiffrées en transit (TLS) et au repos. Vous restez seul·e propriétaire de votre contenu.',
  },
  {
    icon: ShieldCheck,
    title: 'Conformité RGPD',
    description:
      'Plateforme conçue conformément au RGPD : droit d’accès, de rectification et de suppression sur simple demande.',
  },
  {
    icon: EyeOff,
    title: 'Aucune revente de données',
    description:
      'Vos données émotionnelles ne sont jamais vendues à des tiers et ne servent à aucune publicité ciblée.',
  },
  {
    icon: FileCheck,
    title: 'Transparence',
    description:
      'Politique de confidentialité, conditions d’utilisation et gestion des cookies accessibles publiquement.',
  },
];

const SecurityTrustSection: React.FC = () => {
  return (
    <section
      id="securite"
      aria-labelledby="security-title"
      className="py-20 md:py-28 bg-muted/20"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Sécurité et confidentialité
          </p>
          <h2
            id="security-title"
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Vos données, sous votre contrôle
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nous appliquons des principes simples : chiffrement, conformité
            RGPD, et aucune revente de vos données.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {COMMITMENTS.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="p-6 bg-card border-border hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <Link to="/security" className="text-primary underline-offset-4 hover:underline">
            Détails de sécurité
          </Link>
          <Link to="/legal/privacy" className="text-primary underline-offset-4 hover:underline">
            Politique de confidentialité
          </Link>
          <Link to="/legal/cookies" className="text-primary underline-offset-4 hover:underline">
            Gestion des cookies
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SecurityTrustSection;
