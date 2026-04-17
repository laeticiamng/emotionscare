// @ts-nocheck
/**
 * AtAGlanceSection - "En bref" + "Pour qui"
 * Sections explicites pour SEO/GEO et compréhension immédiate.
 */
import React from 'react';
import { Card } from '@/components/ui/card';
import { Activity, Brain, HeartPulse, ShieldCheck, GraduationCap, Stethoscope, Users, Building2 } from 'lucide-react';

const highlights = [
  {
    icon: Activity,
    title: 'Régulation en 3 minutes',
    description: 'Exercices courts validés cliniquement (PSS-10, WHO-5, PHQ-9) pour réguler le stress sans rupture du quotidien.',
  },
  {
    icon: Brain,
    title: 'Coach IA 24h/24',
    description: 'Accompagnement personnalisé par IA conversationnelle, sans jugement, en français.',
  },
  {
    icon: HeartPulse,
    title: 'Scanner émotionnel',
    description: 'Auto-évaluation rapide pour identifier l’état du moment et déclencher la bonne intervention.',
  },
  {
    icon: ShieldCheck,
    title: 'Sécurité renforcée',
    description: 'Données chiffrées, conformité RGPD, hébergement européen. Aucune donnée revendue.',
  },
];

const audiences = [
  {
    icon: GraduationCap,
    title: 'Étudiants en santé',
    description: 'Médecine, pharmacie, IFSI, kiné : prévenir l’épuisement dès la formation.',
  },
  {
    icon: Stethoscope,
    title: 'Soignants en activité',
    description: 'Infirmiers, médecins, aides-soignants : un réflexe entre deux gardes.',
  },
  {
    icon: Users,
    title: 'Particuliers',
    description: 'Toute personne souhaitant un outil sérieux et discret pour sa santé mentale.',
  },
  {
    icon: Building2,
    title: 'Établissements',
    description: 'Hôpitaux, EHPAD, écoles : déploiement collectif avec tableau de bord agrégé.',
  },
];

const AtAGlanceSection: React.FC = () => {
  return (
    <section
      id="en-bref"
      aria-labelledby="at-a-glance-title"
      className="py-20 md:py-28 bg-background"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* En bref */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            En bref
          </p>
          <h2
            id="at-a-glance-title"
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            EmotionsCare en quelques mots
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Plateforme française de régulation émotionnelle conçue pour les métiers du soin et toute personne exposée au stress chronique.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
          {highlights.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="p-6 bg-card border-border hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </Card>
          ))}
        </div>

        {/* Pour qui */}
        <div id="pour-qui" className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Pour qui
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Conçu pour celles et ceux qui prennent soin
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Une réponse adaptée à chaque parcours, du premier stage à la direction d’établissement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {audiences.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="p-6 bg-card border-border hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent-foreground flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AtAGlanceSection;
