// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  ArrowLeft,
  Building,
  Calendar,
  FileText,
  Mail,
  Phone,
  Shield,
  Users,
} from 'lucide-react';

type Section = {
  id: string;
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    id: 'editor',
    icon: Building,
    title: "1. Éditeur du site",
    content: (
      <>
        <p>
          Le site et les applications EmotionsCare sont édités par la société EmotionsCare SAS, société par actions
          simplifiée au capital social de 120 000 €, immatriculée au Registre du Commerce et des Sociétés de Paris sous le
          numéro RCS 902 345 678.
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Siège social : 12 rue des Émotions, 75011 Paris, France.</li>
          <li>Numéro de TVA intracommunautaire : FR 92 902345678.</li>
          <li>Adresse électronique : contact@emotionscare.com.</li>
          <li>Téléphone : +33 (0)1 86 95 12 34.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'director',
    icon: Users,
    title: '2. Direction de la publication',
    content: (
      <>
        <p>
          La directrice de la publication est Léa Martin, en sa qualité de Présidente de EmotionsCare SAS. Elle est
          joignable à l'adresse legal@emotionscare.com pour toute question relative au contenu éditorial.
        </p>
      </>
    ),
  },
  {
    id: 'hosting',
    icon: Shield,
    title: "3. Hébergement et sécurité",
    content: (
      <>
        <p>
          L'hébergement est assuré par Supabase B.V., Vulkanstraat 5, 1014 AR Amsterdam, Pays-Bas. Les données sont
          stockées dans des datacenters certifiés ISO 27001 situés au sein de l'Union européenne et protégées par des
          politiques de sauvegarde quotidienne.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Pour toute information relative à la sécurité ou à la protection des données, consultez notre{' '}
          <Link to="/legal/privacy" className="text-primary underline underline-offset-4">
            Politique de confidentialité
          </Link>.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    icon: Mail,
    title: '4. Contact et support',
    content: (
      <>
        <p>
          Notre équipe reste disponible pour répondre à vos questions techniques, commerciales ou légales :
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1">
          <li>Email support : support@emotionscare.com</li>
          <li>Email juridique : legal@emotionscare.com</li>
          <li>Téléphone : +33 (0)1 86 95 12 34 (du lundi au vendredi, 9h-18h CET)</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ip',
    icon: FileText,
    title: '5. Propriété intellectuelle',
    content: (
      <>
        <p>
          Tous les éléments du site (textes, graphismes, logos, vidéos, animations, bases de données, logiciels) sont la
          propriété exclusive de EmotionsCare SAS ou de ses partenaires et sont protégés par le Code de la propriété
          intellectuelle. Toute reproduction totale ou partielle est interdite sans autorisation écrite préalable.
        </p>
      </>
    ),
  },
  {
    id: 'responsibility',
    icon: AlertTriangle,
    title: '6. Responsabilité',
    content: (
      <>
        <p>
          EmotionsCare met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées. Toutefois,
          la société ne peut être tenue responsable des erreurs involontaires ou omissions, ni des dommages résultant d'une
          intrusion frauduleuse d'un tiers ayant entraîné une modification des informations disponibles.
        </p>
        <p className="mt-3">
          Les liens hypertextes pointant vers d'autres sites ne sauraient engager la responsabilité de EmotionsCare qui ne
          contrôle pas le contenu de ces sites.
        </p>
      </>
    ),
  },
  {
    id: 'report',
    icon: Phone,
    title: '7. Signalement d’un contenu illicite',
    content: (
      <>
        <p>
          Si vous identifiez un contenu susceptible de contrevenir à la loi ou aux bonnes mœurs, vous pouvez adresser un
          signalement motivé à legal@emotionscare.com. Merci d'y joindre l'URL concernée, une description précise des faits
          et vos coordonnées pour faciliter notre traitement.
        </p>
      </>
    ),
  },
  {
    id: 'update',
    icon: Calendar,
    title: '8. Date de dernière mise à jour',
    content: (
      <>
        <p>Les présentes mentions légales ont été mises à jour le 30 août 2025.</p>
      </>
    ),
  },
];

const MentionsPage: React.FC = () => {
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
              <h1 className="text-3xl font-bold text-foreground">Mentions légales</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>Dernière mise à jour : 30 août 2025</span>
              </div>
            </div>
            <Button asChild variant="outline" className="ml-auto">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sommaire</CardTitle>
          </CardHeader>
          <CardContent>
            <nav aria-label="Sommaire des mentions légales">
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

export default MentionsPage;
