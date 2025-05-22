
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TermsPage = () => {
  return (
    <Shell>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Conditions Générales d'Utilisation</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>EmotionsCare - Conditions Générales d'Utilisation</CardTitle>
            <CardDescription>Dernière mise à jour : 22 mai 2025</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">1. Acceptation des conditions</h2>
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du site web et des services 
                proposés par EmotionsCare SAS. En accédant à notre site et en utilisant nos services, vous reconnaissez 
                avoir lu, compris et accepté les présentes CGU.
              </p>
              <p>
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site ou nos services.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">2. Description des services</h2>
              <p>
                EmotionsCare propose des services de bien-être émotionnel, incluant notamment :
              </p>
              <ul>
                <li>Des sessions de musicothérapie personnalisées</li>
                <li>Des outils d'analyse et de suivi émotionnel</li>
                <li>Des recommandations personnalisées pour améliorer votre bien-être</li>
                <li>Des services dédiés aux entreprises pour le suivi du bien-être des collaborateurs</li>
              </ul>
              <p>
                EmotionsCare se réserve le droit de modifier, suspendre ou interrompre tout ou partie de ses services 
                à tout moment et sans préavis.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">3. Inscription et compte utilisateur</h2>
              <p>
                Pour accéder à certains de nos services, vous devrez créer un compte utilisateur. Vous êtes responsable 
                de maintenir la confidentialité de vos identifiants de connexion et de toutes les activités effectuées 
                depuis votre compte.
              </p>
              <p>
                Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre inscription 
                et à les mettre à jour si nécessaire.
              </p>
              <p>
                Nous nous réservons le droit de suspendre ou de supprimer votre compte si nous estimons que vous avez 
                enfreint les présentes CGU ou si votre compte reste inactif pendant une période prolongée.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">4. Utilisation des services</h2>
              <p>
                Vous vous engagez à utiliser nos services conformément aux lois applicables et aux présentes CGU. 
                Vous ne devez pas :
              </p>
              <ul>
                <li>Utiliser nos services à des fins illégales ou non autorisées</li>
                <li>Tenter d'accéder de manière non autorisée à nos systèmes ou réseaux</li>
                <li>Perturber ou interrompre le fonctionnement de nos services</li>
                <li>Collecter des informations sur d'autres utilisateurs sans leur consentement</li>
                <li>Créer plusieurs comptes ou créer un compte au nom d'une autre personne</li>
              </ul>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">5. Propriété intellectuelle</h2>
              <p>
                Tous les contenus présents sur notre site (textes, images, logos, logiciels, etc.) sont protégés 
                par des droits de propriété intellectuelle et appartiennent à EmotionsCare SAS ou à ses partenaires.
              </p>
              <p>
                L'utilisation de nos services ne vous confère aucun droit de propriété sur nos contenus. 
                Toute reproduction, représentation, modification ou exploitation de ces contenus sans autorisation 
                préalable est strictement interdite.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">6. Responsabilité</h2>
              <p>
                Nos services sont fournis "en l'état" et "selon disponibilité". Nous ne garantissons pas que nos services 
                seront exempts d'erreurs, de virus ou d'interruptions.
              </p>
              <p>
                EmotionsCare ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation 
                ou de l'impossibilité d'utiliser nos services.
              </p>
              <p>
                Les informations et recommandations fournies par nos services ne constituent pas un avis médical professionnel. 
                Si vous souffrez de troubles psychologiques ou émotionnels graves, veuillez consulter un professionnel de santé qualifié.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">7. Tarifs et paiements</h2>
              <p>
                Certains de nos services sont payants et peuvent nécessiter un abonnement ou un paiement ponctuel. 
                Les tarifs sont indiqués sur notre site et peuvent être modifiés à tout moment.
              </p>
              <p>
                Les paiements sont sécurisés et traités par nos partenaires de paiement. En souscrivant à nos services payants, 
                vous vous engagez à fournir des informations de paiement valides et à vous acquitter des sommes dues.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">8. Résiliation</h2>
              <p>
                Vous pouvez résilier votre compte à tout moment depuis les paramètres de votre compte ou en nous contactant.
              </p>
              <p>
                Nous nous réservons le droit de résilier ou de suspendre votre accès à nos services, sans préavis et à notre 
                seule discrétion, notamment en cas de violation des présentes CGU.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Modifications des CGU</h2>
              <p>
                Nous pouvons modifier les présentes CGU à tout moment. La version mise à jour sera publiée sur notre site 
                avec la date de dernière mise à jour.
              </p>
              <p>
                En continuant à utiliser nos services après la publication des CGU modifiées, vous acceptez ces modifications.
              </p>
              <p>
                Nous vous encourageons à consulter régulièrement nos CGU pour rester informé des conditions d'utilisation de nos services.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default TermsPage;
