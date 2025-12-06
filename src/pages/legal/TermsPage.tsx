import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle,
  FileText,
  ShieldCheck,
  Users,
  Wrench,
} from 'lucide-react';

type Section = {
  id: string;
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    id: 'scope',
    icon: FileText,
    title: "1. Objet et acceptation",
    content: (
      <>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme
          EmotionsCare, qu'elle soit consultée via le web, les applications mobiles ou les expériences VR. En créant un
          compte ou en utilisant nos services, vous reconnaissez avoir lu et accepté ces conditions. Elles s'appliquent à
          tous les utilisateurs : particuliers (B2C), entreprises (B2B), administrateurs et membres d'équipes invitées.
        </p>
        <p className="mt-3">
          Si vous n'acceptez pas ces CGU, vous devez cesser toute utilisation du service. Nous recommandons vivement la
          consultation conjointe de notre{' '}
          <Link to="/legal/privacy" className="text-primary underline underline-offset-4">
            Politique de confidentialité
          </Link>{' '}
          ainsi que de nos{' '}
          <Link to="/legal/sales" className="text-primary underline underline-offset-4">
            Conditions Générales de Vente
          </Link>{' '}
          pour une vision complète de nos engagements contractuels.
        </p>
      </>
    ),
  },
  {
    id: 'services',
    icon: BookOpen,
    title: '2. Description des services',
    content: (
      <>
        <p>
          EmotionsCare propose une suite d'outils de bien-être émotionnel combinant intelligence artificielle, thérapies
          immersives et accompagnement professionnel. Les fonctionnalités principales incluent :
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Analyse émotionnelle multimodale (voix, visage, rythme cardiaque) avec consentement explicite.</li>
          <li>Coach IA conversationnel, exercices guidés et programmes personnalisés.</li>
          <li>Journal émotionnel, métriques de progression et exports RGPD sécurisés.</li>
          <li>Modules collaboratifs pour les équipes, incluant analytics anonymisées (k-anonymat ≥ 5).</li>
          <li>Expériences VR & audio thérapie pour la relaxation ou la préparation mentale.</li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Nos contenus ont vocation à soutenir le bien-être et ne remplacent pas un suivi médical ou psychologique. En
          cas d'urgence, contactez les services de santé compétents.
        </p>
      </>
    ),
  },
  {
    id: 'accounts',
    icon: Users,
    title: '3. Création de compte et obligations des utilisateurs',
    content: (
      <>
        <h4 className="font-semibold">Éligibilité</h4>
        <p>
          L'ouverture d'un compte nécessite d'avoir 16 ans révolus. Les mineurs de 16 à 18 ans doivent disposer de
          l'autorisation d'un représentant légal. Les comptes entreprises sont réservés aux organisations disposant d'une
          personnalité morale.
        </p>
        <h4 className="mt-3 font-semibold">Exactitude et sécurité</h4>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>Fournir des informations exactes et les tenir à jour.</li>
          <li>Protéger la confidentialité de vos identifiants et dispositifs d'authentification.</li>
          <li>Informer EmotionsCare sans délai de toute utilisation non autorisée de votre compte.</li>
          <li>Respecter les droits des autres utilisateurs et l'intégrité des contenus partagés.</li>
        </ul>
        <p className="mt-3">
          Les administrateurs B2B sont responsables de la gestion des accès de leurs collaborateurs et de la conformité
          de l'usage réalisé au sein de leur organisation.
        </p>
      </>
    ),
  },
  {
    id: 'usage',
    icon: CheckCircle,
    title: "4. Conditions d'utilisation",
    content: (
      <>
        <h4 className="font-semibold">Utilisations autorisées</h4>
        <p>
          Vous pouvez utiliser EmotionsCare pour votre bien-être personnel, la prévention des risques psychosociaux en
          entreprise et l'accompagnement de vos équipes, conformément aux fonctionnalités activées dans votre offre.
        </p>
        <h4 className="mt-3 font-semibold">Utilisations interdites</h4>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>Collecter des données sans consentement ou détourner les finalités prévues.</li>
          <li>Contourner nos mesures de sécurité, analyser le code source ou injecter des scripts.</li>
          <li>Diffuser des contenus illicites, diffamatoires, haineux ou portant atteinte à la vie privée.</li>
          <li>Revendre, prêter ou partager l'accès au service sans accord contractuel spécifique.</li>
          <li>Utiliser EmotionsCare pour des diagnostics médicaux ou thérapeutiques sans supervision clinique.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'privacy',
    icon: ShieldCheck,
    title: '5. Protection des données et confidentialité',
    content: (
      <>
        <p>
          Nous appliquons le référentiel interne ECC-RGPD-01 pour garantir que seules les données strictement
          nécessaires sont collectées et traitées. Les traitements reposent sur votre consentement explicite ou sur
          l'exécution du contrat lorsque vous êtes une organisation cliente.
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Chiffrement des données en transit et au repos (AES-256, TLS 1.3).</li>
          <li>Stockage dans l'Union européenne auprès de prestataires certifiés ISO 27001.</li>
          <li>Export, rectification et suppression disponibles 24/7 depuis vos paramètres.</li>
          <li>Anonymisation et agrégation automatiques pour les tableaux de bord d'équipe.</li>
        </ul>
        <p className="mt-3">
          Pour toute précision complémentaire, veuillez consulter notre{' '}
          <Link to="/legal/privacy" className="text-primary underline underline-offset-4">
            Politique de confidentialité détaillée
          </Link>{' '}
          ainsi que notre{' '}
          <Link to="/legal/cookies" className="text-primary underline underline-offset-4">
            Politique relative aux cookies
          </Link>.
        </p>
      </>
    ),
  },
  {
    id: 'billing',
    icon: Building2,
    title: '6. Services payants et abonnements',
    content: (
      <>
        <p>
          Certaines fonctionnalités (musicothérapie premium, modules VR avancés, analytics B2B) sont proposées via des
          abonnements payants. Les modalités de tarification, de facturation et de résiliation sont décrites dans nos{' '}
          <Link to="/legal/sales" className="text-primary underline underline-offset-4">
            Conditions Générales de Vente
          </Link>.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          En cas de contradiction entre les présentes CGU et les CGV, ce sont les CGV qui prévalent pour les aspects
          financiers.
        </p>
      </>
    ),
  },
  {
    id: 'availability',
    icon: Wrench,
    title: '7. Disponibilité du service et maintenance',
    content: (
      <>
        <p>
          Nous nous efforçons de garantir une disponibilité annuelle de 99,5 %. Des opérations de maintenance peuvent
          entraîner des interruptions programmées, notifiées en amont via notre centre de statut. En cas d'incident
          majeur, nous appliquons notre plan de continuité (RPO &lt; 1 heure, RTO &lt; 4 heures).
        </p>
        <p className="mt-3">
          Nous ne sommes pas responsables des indisponibilités causées par votre connexion Internet, vos équipements ou
          les plateformes tierces non contrôlées par EmotionsCare.
        </p>
      </>
    ),
  },
  {
    id: 'ip',
    icon: Calendar,
    title: '8. Propriété intellectuelle et contenus',
    content: (
      <>
        <p>
          La marque EmotionsCare, son identité visuelle, les interfaces, algorithmes, bases de données et contenus
          pédagogiques sont protégés par le droit d'auteur et le droit des marques. Aucune reproduction ou diffusion sans
          autorisation écrite n'est permise.
        </p>
        <p className="mt-3">
          Vous conservez la propriété des contenus personnels que vous enregistrez (journal, enregistrements vocaux,
          données biométriques). Vous nous accordez une licence non exclusive, mondiale et révocable pour opérer le
          service et générer vos tableaux de bord personnels.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    icon: ShieldCheck,
    title: '9. Responsabilité',
    content: (
      <>
        <p>
          EmotionsCare agit en tant que plateforme de support au bien-être. La responsabilité d'EmotionsCare ne saurait
          être engagée pour les dommages indirects, pertes de profits ou préjudices immatériels. Pour les offres
          payantes, l'indemnisation maximale est limitée au montant payé au cours des douze (12) derniers mois.
        </p>
        <p className="mt-3">
          Les organisations clientes restent responsables des obligations légales liées à la gestion de leurs équipes et
          à l'utilisation des données mises à disposition via nos tableaux de bord.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    icon: Calendar,
    title: '10. Évolution des CGU et contact',
    content: (
      <>
        <p>
          Nous pouvons adapter ces CGU afin de suivre l'évolution du service ou des exigences réglementaires. Toute
          modification substantielle est notifiée 30 jours avant son entrée en vigueur via email et dans l'application.
        </p>
        <p className="mt-3">
          Pour toute question concernant ces CGU, vous pouvez contacter notre équipe juridique :
        </p>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>Email : legal@emotionscare.com</li>
          <li>Adresse : 12 rue des Émotions, 75011 Paris, France</li>
          <li>Téléphone : +33 (0)1 86 95 12 34</li>
        </ul>
      </>
    ),
  },
];

const TermsPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
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
              <h1 className="text-3xl font-bold text-foreground">Conditions Générales d'Utilisation</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>Dernière mise à jour : 30 août 2025</span>
              </div>
            </div>
            <Button asChild variant="outline" className="ml-auto">
              <Link to="/contact">Contacter le support</Link>
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sommaire</CardTitle>
          </CardHeader>
          <CardContent>
            <nav aria-label="Sommaire des sections des CGU">
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

export default TermsPage;
