// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CreditCard,
  FileText,
  Handshake,
  HelpCircle,
  Scale,
  ShieldCheck,
} from 'lucide-react';

type Section = {
  id: string;
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    id: 'object',
    icon: FileText,
    title: '1. Objet',
    content: (
      <>
        <p>
          Les présentes Conditions Générales de Vente (CGV) encadrent la souscription et l'utilisation des offres
          payantes proposées par EmotionsCare SASU. Elles complètent les{' '}
          <Link to="/legal/terms" className="text-primary underline underline-offset-4">
            Conditions Générales d'Utilisation
          </Link>{' '}
          et prévalent pour toute disposition relative à la facturation, au paiement et aux garanties commerciales.
        </p>
      </>
    ),
  },
  {
    id: 'plans',
    icon: Handshake,
    title: '2. Formules d’abonnement',
    content: (
      <>
        <p>
          EmotionsCare propose des abonnements mensuels ou annuels, destinés aux particuliers (B2C) et aux organisations
          (B2B). Chaque formule précise les modules inclus, le nombre d'utilisateurs autorisés et les niveaux de support.
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li><strong>Offre Serenity (B2C) :</strong> accès complet aux modules bien-être personnels.</li>
          <li><strong>Offre Team Care (B2B) :</strong> analytics d'équipe, tableaux de bord managers, anonymisation k≥5.</li>
          <li><strong>Offre Enterprise :</strong> intégrations SSO/SCIM, SLA renforcé, assistance dédiée.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'pricing',
    icon: CreditCard,
    title: '3. Tarifs et paiement',
    content: (
      <>
        <p>
          Les tarifs sont exprimés en euros hors taxes et affichés sur le site emotionscare.com. Les paiements sont
          sécurisés via notre partenaire Stripe. Les organisations peuvent solliciter une facturation sur bon de commande
          (Net 30) à partir de 50 licences.
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Le paiement est exigible à l'échéance convenue (mensuelle ou annuelle).</li>
          <li>Tout retard de paiement entraîne des pénalités calculées au taux légal en vigueur.</li>
          <li>Les remises ou offres promotionnelles sont non cumulables et limitées dans le temps.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'duration',
    icon: Calendar,
    title: '4. Durée, renouvellement et résiliation',
    content: (
      <>
        <p>
          Les abonnements sont reconduits tacitement à chaque échéance. Vous pouvez résilier depuis votre espace client
          jusqu'à 48 heures avant la date de renouvellement. La résiliation prend effet à la fin de la période en cours.
        </p>
        <p className="mt-3">
          En cas de manquement grave aux CGV ou CGU, EmotionsCare se réserve le droit de suspendre l'accès au service après
          notification formelle. La suspension ne donne lieu à aucun remboursement des sommes déjà versées.
        </p>
      </>
    ),
  },
  {
    id: 'withdrawal',
    icon: Scale,
    title: '5. Droit de rétractation',
    content: (
      <>
        <p>
          Conformément aux articles L221-18 et suivants du Code de la consommation, les clients particuliers disposent d'un
          délai de quatorze (14) jours pour exercer leur droit de rétractation lorsqu'aucune utilisation du service n'a
          débuté. Une demande doit être adressée par email à billing@emotionscare.com. L'accès au service sera suspendu et
          les sommes versées remboursées sous 14 jours.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Les clients professionnels renoncent au droit de rétractation dès la mise à disposition du service conformément
          à l'article L221-3 du Code de la consommation.
        </p>
      </>
    ),
  },
  {
    id: 'guarantees',
    icon: ShieldCheck,
    title: '6. Garanties et niveau de service',
    content: (
      <>
        <p>
          EmotionsCare met en œuvre des moyens raisonnables pour assurer une disponibilité de 99,5 % et un support en
          semaine (SLA : réponse sous 8 heures ouvrées). Les offres Enterprise incluent un canal d'astreinte 24/7.
        </p>
        <p className="mt-3">
          En cas d'indisponibilité supérieure à 4 heures consécutives imputable à EmotionsCare, un avoir commercial équivalent
          à une journée d'abonnement peut être accordé sur demande motivée.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    icon: CheckCircle,
    title: '7. Responsabilité',
    content: (
      <>
        <p>
          EmotionsCare ne saurait être tenue responsable des dommages indirects, pertes de données ou préjudices immatériels.
          L'indemnisation éventuelle est limitée au montant des sommes facturées au cours des douze (12) derniers mois.
        </p>
        <p className="mt-3">
          Les clients professionnels demeurent responsables du respect des réglementations applicables à leurs activités et
          de l'utilisation des données collectées via EmotionsCare.
        </p>
      </>
    ),
  },
  {
    id: 'privacy',
    icon: ShieldCheck,
    title: '8. Protection des données et conformité',
    content: (
      <>
        <p>
          Nous appliquons la charte interne ECC-RGPD-01 qui impose la minimisation des données, la tenue d'un registre de
          traitements et des durées de conservation limitées. Les données des utilisateurs restent la propriété des clients
          et sont traitées conformément à notre{' '}
          <Link to="/legal/privacy" className="text-primary underline underline-offset-4">
            Politique de confidentialité
          </Link>{' '}
          et à notre{' '}
          <Link to="/legal/cookies" className="text-primary underline underline-offset-4">
            Politique cookies
          </Link>.
        </p>
      </>
    ),
  },
  {
    id: 'disputes',
    icon: HelpCircle,
    title: '9. Médiation et droit applicable',
    content: (
      <>
        <p>
          Les CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité.
          Les consommateurs peuvent saisir le médiateur de la consommation CMAP (www.cmap.fr) après nous avoir contactés.
        </p>
        <p className="mt-3">
          À défaut d'accord amiable, les tribunaux compétents de Paris seront seuls compétents.
        </p>
      </>
    ),
  },
];

const SalesPage: React.FC = () => {
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
              <h1 className="text-3xl font-bold text-foreground">Conditions Générales de Vente</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>Dernière mise à jour : 30 août 2025</span>
              </div>
            </div>
            <Button asChild variant="outline" className="ml-auto">
              <Link to="/contact">Parler à notre équipe</Link>
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sommaire</CardTitle>
          </CardHeader>
          <CardContent>
            <nav aria-label="Sommaire des CGV">
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

export default SalesPage;
