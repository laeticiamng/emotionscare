import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/lib/routes';
import { usePageSEO } from '@/hooks/usePageSEO';

/**
 * Page Conditions Générales d'Utilisation
 */
export const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  usePageSEO({
    title: 'Conditions Générales d\'Utilisation - EmotionsCare',
    description: 'Conditions générales d\'utilisation de la plateforme EmotionsCare : règles d\'accès, responsabilités, propriété intellectuelle et modération du contenu.',
    keywords: 'CGU, conditions utilisation, règles, responsabilités, EmotionsCare, plateforme bien-être'
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          onClick={() => navigate(routes.public.home())}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Conditions Générales d&apos;Utilisation</CardTitle>
            <p className="text-sm text-muted-foreground">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </CardHeader>

          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <h2>1. Objet</h2>
            <p>
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et
              l&apos;utilisation de la plateforme EmotionsCare, un service de bien-être émotionnel
              et de suivi de santé mentale.
            </p>

            <h2>2. Acceptation des conditions</h2>
            <p>
              En accédant à EmotionsCare, vous acceptez sans réserve les présentes CGU. Si vous
              n&apos;acceptez pas ces conditions, veuillez ne pas utiliser nos services.
            </p>

            <h2>3. Services proposés</h2>
            <p>EmotionsCare propose :</p>
            <ul>
              <li>Suivi émotionnel par IA</li>
              <li>Exercices de respiration et méditation</li>
              <li>Musicothérapie adaptative</li>
              <li>Journal émotionnel</li>
              <li>Coaching IA personnalisé</li>
              <li>Modules de gamification du bien-être</li>
            </ul>

            <h2>4. Inscription et compte utilisateur</h2>
            <p>
              L&apos;utilisation de certaines fonctionnalités nécessite la création d&apos;un compte.
              Vous vous engagez à fournir des informations exactes et à maintenir la
              confidentialité de vos identifiants.
            </p>

            <h2>5. Protection des données</h2>
            <p>
              Vos données personnelles et de santé sont traitées conformément à notre Politique
              de Confidentialité et au RGPD. Consultez notre page dédiée pour plus d&apos;informations.
            </p>

            <h2>6. Utilisation acceptable</h2>
            <p>Vous vous engagez à ne pas :</p>
            <ul>
              <li>Utiliser le service à des fins illégales</li>
              <li>Partager vos identifiants avec des tiers</li>
              <li>Tenter de contourner les mesures de sécurité</li>
              <li>Extraire ou copier le contenu de manière automatisée</li>
            </ul>

            <h2>7. Propriété intellectuelle</h2>
            <p>
              Tous les contenus, marques et éléments de la plateforme sont protégés par le
              droit d&apos;auteur et restent la propriété d&apos;EmotionsCare.
            </p>

            <h2>8. Limitation de responsabilité</h2>
            <p>
              EmotionsCare est un outil de bien-être et ne remplace pas un suivi médical
              professionnel. En cas de détresse psychologique, contactez un professionnel de
              santé ou les services d&apos;urgence.
            </p>

            <h2>9. Modifications des CGU</h2>
            <p>
              Nous nous réservons le droit de modifier ces CGU à tout moment. Les utilisateurs
              seront informés des changements significatifs.
            </p>

            <h2>10. Contact</h2>
            <p>
              Pour toute question concernant ces CGU :<br />
              Email : legal@emotionscare.com<br />
              Adresse : EmotionsCare, France
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage;
