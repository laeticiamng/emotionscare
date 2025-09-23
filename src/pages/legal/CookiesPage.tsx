import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Cookie,
  Lock,
  PieChart,
  Settings,
  ShieldCheck,
  Sliders,
} from 'lucide-react';

const sections = [
  {
    id: 'purpose',
    icon: Cookie,
    title: '1. Objet de la politique',
    content: (
      <>
        <p>
          La présente politique explique comment EmotionsCare SAS utilise les cookies et traceurs au sein de ses sites web
          et applications. Elle complète notre{' '}
          <Link to="/legal/privacy" className="text-primary underline underline-offset-4">
            Politique de confidentialité
          </Link>{' '}
          et détaille les engagements imposés par notre référentiel interne ECC-RGPD-01.
        </p>
      </>
    ),
  },
  {
    id: 'principles',
    icon: ShieldCheck,
    title: '2. Principes ECC-RGPD-01',
    content: (
      <>
        <p>
          ECC-RGPD-01 repose sur trois piliers : minimisation, transparence et contrôle utilisateur. Concrètement :
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Aucun cookie non essentiel n'est déposé sans votre consentement explicite.</li>
          <li>Les finalités et durées de conservation sont communiquées avant obtention du consentement.</li>
          <li>Vous pouvez modifier vos préférences à tout moment depuis le bandeau ou les paramètres du compte.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'essential',
    icon: Lock,
    title: '3. Cookies strictement nécessaires',
    content: (
      <>
        <p>
          Ces cookies sont indispensables au bon fonctionnement d'EmotionsCare et sont déposés par défaut. Ils permettent
          notamment :
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>La gestion de votre session authentifiée et la sécurisation des connexions (token chiffré, anti-CSRF).</li>
          <li>La mémorisation de vos préférences d'accessibilité (mode sombre, taille de police).</li>
          <li>Le routage de charge et la détection d'incidents techniques.</li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Ces cookies n'impliquent aucun suivi publicitaire et expirent au plus tard 48 heures après la fin de session.
        </p>
      </>
    ),
  },
  {
    id: 'analytics',
    icon: PieChart,
    title: '4. Cookies de mesure d’audience (opt-in)',
    content: (
      <>
        <p>
          Nous utilisons Matomo, hébergé sur notre infrastructure européenne, pour mesurer l'usage du site. Les données sont
          anonymisées (masquage IP, horodatages agrégés) et conservées 13 mois maximum.
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Finalités : améliorer l'ergonomie et prioriser les améliorations produit.</li>
          <li>Consentement : désactivé par défaut, activable via le bandeau ou les paramètres.</li>
          <li>Transfert : aucun transfert hors UE, aucune revente de données.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'functional',
    icon: Settings,
    title: '5. Cookies fonctionnels et personnalisation',
    content: (
      <>
        <p>
          Certains modules (playlist personnalisée, sauvegarde des exercices favoris) nécessitent un cookie optionnel pour
          mémoriser vos choix sur plusieurs appareils.
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Durée maximale : 6 mois.</li>
          <li>Absence totale de suivi tiers ou publicitaire.</li>
          <li>Possibilité de les refuser sans impact sur l'accès aux fonctionnalités essentielles.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'management',
    icon: Sliders,
    title: '6. Gestion des consentements',
    content: (
      <>
        <p>
          Dès votre première visite, un bandeau permet d'accepter ou de refuser chaque catégorie de cookies. Vous pouvez
          revenir sur votre choix :
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Depuis le lien « Paramétrer les cookies » présent en pied de page.</li>
          <li>Dans l'application, via Paramètres &gt; Confidentialité &gt; Préférences cookies.</li>
          <li>En supprimant les cookies depuis votre navigateur (Chrome, Firefox, Safari...).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'rights',
    icon: CheckCircle,
    title: '7. Vos droits',
    content: (
      <>
        <p>
          Vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition. Pour exercer ces droits ou poser
          une question sur notre politique cookies, contactez notre Délégué à la Protection des Données :
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Email : dpo@emotionscare.com</li>
          <li>Adresse : EmotionsCare – DPO, 12 rue des Émotions, 75011 Paris</li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Une réponse vous sera apportée sous 30 jours maximum, conformément à l'article 12 du RGPD.
        </p>
      </>
    ),
  },
  {
    id: 'update',
    icon: Calendar,
    title: '8. Mise à jour de la politique',
    content: (
      <>
        <p>
          Cette politique peut être actualisée pour refléter l'évolution de nos pratiques ou des exigences réglementaires.
          En cas de changement majeur, une notification sera affichée lors de votre prochaine visite.
        </p>
        <p className="mt-3">Dernière mise à jour : 30 août 2025.</p>
      </>
    ),
  },
];

const CookiesPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Politique relative aux cookies</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>Dernière mise à jour : 30 août 2025</span>
              </div>
            </div>
            <Button asChild variant="outline" className="ml-auto">
              <Link to="/contact">Parler à un expert confidentialité</Link>
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sommaire</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="grid gap-2 md:grid-cols-2" aria-label="Sommaire de la politique cookies">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="text-primary hover:underline">
                  {section.title}
                </a>
              ))}
            </nav>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {sections.map((section) => (
            <Card key={section.id} id={section.id}>
              <CardHeader className="flex flex-row items-start gap-3">
                <section.icon className="h-6 w-6 text-primary mt-1" aria-hidden="true" />
                <div>
                  <CardTitle>{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="prose max-w-none dark:prose-invert">
                {section.content}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CookiesPage;
