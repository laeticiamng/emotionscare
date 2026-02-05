// @ts-nocheck
import React from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Cookie,
  ListChecks,
  Lock,
  PieChart,
  Settings,
  ShieldCheck,
  Sliders,
} from 'lucide-react';

type Section = {
  id: string;
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    id: 'purpose',
    icon: Cookie,
    title: '1. Objet de la politique',
    content: (
      <>
        <p>
          La présente politique explique comment EmotionsCare SASU utilise les cookies et traceurs au sein de ses sites web
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
          ECC-RGPD-01 repose sur trois piliers : minimisation, transparence et contrôle utilisateur. Nous appliquons ces
          principes en catégorisant clairement chaque traceur et en recueillant un consentement éclairé.
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Aucun cookie non essentiel n'est déposé sans votre consentement explicite et traçable.</li>
          <li>Les finalités, durées et destinataires sont communiqués avant tout dépôt optionnel.</li>
          <li>Vous pouvez modifier vos préférences à tout moment depuis le bandeau, le pied de page ou votre compte.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'inventory',
    icon: ListChecks,
    title: '3. Inventaire des cookies et traceurs',
    content: (
      <>
        <p>
          Nos dépôts sont limités aux éléments indispensables au service et à la mesure d'audience anonymisée. Le tableau
          ci-dessous synthétise les traceurs actifs et leurs paramètres principaux.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border border-border">
            <caption className="text-left p-3 font-medium">
              Synthèse des cookies et traceurs utilisés sur le site
            </caption>
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th scope="col" className="p-3 text-left font-semibold">Nom / type</th>
                <th scope="col" className="p-3 text-left font-semibold">Fournisseur</th>
                <th scope="col" className="p-3 text-left font-semibold">Finalité</th>
                <th scope="col" className="p-3 text-left font-semibold">Durée</th>
                <th scope="col" className="p-3 text-left font-semibold">Consentement</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="p-3">ec_session (cookie 1re partie)</td>
                <td className="p-3">EmotionsCare</td>
                <td className="p-3">Authentification sécurisée, prévention CSRF</td>
                <td className="p-3">Session &lt;= 48 h</td>
                <td className="p-3">Essentiel – déposé par défaut</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3">supabase-auth-token (cookie 1re partie)</td>
                <td className="p-3">Supabase (UE)</td>
                <td className="p-3">Maintien de la session chiffrée</td>
                <td className="p-3">Session</td>
                <td className="p-3">Essentiel – déposé par défaut</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3">ec_preferences (cookie 1re partie)</td>
                <td className="p-3">EmotionsCare</td>
                <td className="p-3">Sauvegarde du thème, des options d'accessibilité</td>
                <td className="p-3">6 mois</td>
                <td className="p-3">Fonctionnel – nécessite votre consentement</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3">matomo_* (cookie 1re partie)</td>
                <td className="p-3">Matomo auto-hébergé (UE)</td>
                <td className="p-3">Mesure d'audience anonymisée</td>
                <td className="p-3">13 mois</td>
                <td className="p-3">Analytics – désactivé par défaut</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3">cookie_consent_v1 (stockage local)</td>
                <td className="p-3">EmotionsCare</td>
                <td className="p-3">Preuve de vos choix de consentement</td>
                <td className="p-3">12 mois</td>
                <td className="p-3">Essentiel – sans pistage publicitaire</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Nous n'utilisons pas de cookies marketing ni de traceurs publicitaires tiers. Toute nouvelle catégorie fera l'objet
          d'une demande de consentement distincte avant activation.
        </p>
      </>
    ),
  },
  {
    id: 'essential',
    icon: Lock,
    title: '4. Cookies strictement nécessaires',
    content: (
      <>
        <p>
          Ces cookies permettent le fonctionnement technique du service. Ils couvrent l'authentification, la protection des
          formulaires et la répartition de charge. Sans eux, vous ne pourriez pas accéder à votre espace sécurisé.
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Chiffrement des tokens et renouvellement silencieux de session.</li>
          <li>Protection anti-CSRF et journalisation des tentatives de connexion.</li>
          <li>Preuve de consentement stockée côté navigateur (clé cookie_consent_v1).</li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Conformément à ECC-RGPD-01, leur dépôt repose sur notre intérêt légitime de sécurité et respecte la minimisation
          des données (aucune donnée marketing ou profilage comportemental).
        </p>
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
          Nous déposons un cookie optionnel « ec_preferences » uniquement si vous choisissez d'activer la personnalisation :
          mémorisation du mode sombre, lecture continue des exercices ou favoris partagés entre appareils.
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Durée maximale : 6 mois avec possibilité de suppression immédiate depuis vos paramètres.</li>
          <li>Aucune transmission à des partenaires publicitaires ou réseaux sociaux.</li>
          <li>Le refus n'altère pas l'accès aux fonctionnalités essentielles du produit.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'analytics',
    icon: PieChart,
    title: '6. Cookies de mesure d’audience (opt-in)',
    content: (
      <>
        <p>
          Nous utilisons Matomo, auto-hébergé dans l'Union européenne, pour comprendre l'usage de notre plateforme et
          prioriser les améliorations. Les données collectées sont immédiatement anonymisées (masquage IP, génération d'ID
          aléatoires) conformément à ECC-RGPD-01.
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Consentement : désactivé par défaut, activable depuis le bandeau ou vos paramètres.</li>
          <li>Durée de conservation : 13 mois maximum puis suppression automatique.</li>
          <li>Transferts : aucun transfert hors UE, aucune revente ou croisement avec d'autres sources.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'management',
    icon: Sliders,
    title: '7. Gestion des consentements et preuve',
    content: (
      <>
        <p>
          Dès votre première visite, un bandeau affiche trois options : « Essentiels uniquement », « Tout accepter » ou
          « Paramétrer ». Vos choix sont conservés localement (clé cookie_consent_v1) et synchronisés dans notre registre de
          consentements pour audit interne.
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Vous pouvez ré-ouvrir le module via le lien « Paramétrer les cookies » en pied de page.</li>
          <li>Dans l'application, rendez-vous dans Paramètres &gt; Confidentialité &gt; Préférences cookies.</li>
          <li>Vous pouvez supprimer manuellement les cookies ou le stockage local depuis votre navigateur.</li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          En cas de contrôle, nous sommes en mesure de prouver la version de la politique acceptée, l'horodatage et les
          catégories activées, conformément au principe de traçabilité d'ECC-RGPD-01.
        </p>
      </>
    ),
  },
  {
    id: 'rights',
    icon: CheckCircle,
    title: '8. Vos droits',
    content: (
      <>
        <p>
          Vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition. Pour exercer ces droits ou poser
          une question sur notre politique cookies, contactez notre Délégué à la Protection des Données :
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Email : dpo@emotionscare.com</li>
          <li>Adresse : EmotionsCare SASU – DPO, 5 rue Caudron, 80000 Amiens</li>
          <li>Si besoin, saisissez la CNIL (www.cnil.fr) après nous avoir contactés.</li>
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
    title: '9. Mise à jour de la politique',
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
  usePageSEO({
    title: 'Politique Cookies - EmotionsCare',
    description: 'Politique cookies EmotionsCare : types de cookies utilisés, finalités, durées de conservation et gestion de vos préférences. Conformité ePrivacy.',
    keywords: 'cookies, traceurs, politique cookies, consentement, analytics, EmotionsCare'
  });

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
            <nav aria-label="Sommaire de la politique cookies">
              <ol className="grid gap-2 md:grid-cols-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-primary hover:underline">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const headingId = `${section.id}-title`;
            return (
              <section key={section.id} id={section.id} aria-labelledby={headingId}>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3">
                    <Icon className="h-6 w-6 text-primary mt-1" aria-hidden="true" />
                    <div>
                      <CardTitle id={headingId}>{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="prose max-w-none dark:prose-invert">
                    {section.content}
                  </CardContent>
                </Card>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default CookiesPage;
