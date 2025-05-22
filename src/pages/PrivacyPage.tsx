
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPage = () => {
  return (
    <Shell>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>EmotionsCare - Politique de confidentialité</CardTitle>
            <CardDescription>Dernière mise à jour : 22 mai 2025</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p>
                La présente Politique de confidentialité vous informe de la manière dont EmotionsCare SAS collecte, 
                utilise et protège les données personnelles que vous nous fournissez lorsque vous utilisez notre site web 
                et nos services.
              </p>
              <p>
                Nous nous engageons à assurer la protection de votre vie privée et la sécurité de vos données personnelles, 
                conformément au Règlement Général sur la Protection des Données (RGPD) et aux autres lois applicables en 
                matière de protection des données.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">2. Collecte des données</h2>
              <p>
                Nous collectons des données personnelles lorsque vous :
              </p>
              <ul>
                <li>Créez un compte sur notre plateforme</li>
                <li>Utilisez nos services de musicothérapie et de bien-être</li>
                <li>Remplissez des formulaires d'évaluation émotionnelle</li>
                <li>Communiquez avec notre service client</li>
                <li>Vous inscrivez à notre newsletter</li>
                <li>Visitez notre site web</li>
              </ul>
              <p>
                Les données personnelles collectées peuvent inclure :
              </p>
              <ul>
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Données démographiques (âge, sexe)</li>
                <li>Données sur votre état émotionnel</li>
                <li>Préférences musicales</li>
                <li>Données de navigation et d'utilisation</li>
              </ul>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">3. Utilisation des données</h2>
              <p>
                Nous utilisons vos données personnelles pour :
              </p>
              <ul>
                <li>Fournir, personnaliser et améliorer nos services</li>
                <li>Créer et gérer votre compte</li>
                <li>Générer des recommandations musicales personnalisées</li>
                <li>Analyser votre état émotionnel et vous fournir un suivi</li>
                <li>Communiquer avec vous concernant nos services</li>
                <li>Traiter vos paiements et abonnements</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">4. Conservation des données</h2>
              <p>
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services 
                ou pour respecter nos obligations légales.
              </p>
              <p>
                Les données relatives à votre compte sont conservées tant que votre compte est actif. 
                À la suppression de votre compte, vos données personnelles seront supprimées ou anonymisées dans un délai de 30 jours, 
                sauf si la loi nous oblige à les conserver plus longtemps.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">5. Partage des données</h2>
              <p>
                Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager vos données avec :
              </p>
              <ul>
                <li>Nos prestataires de services qui nous aident à fournir nos services (hébergement, paiement, etc.)</li>
                <li>Les partenaires avec lesquels nous collaborons pour offrir des services spécifiques, avec votre consentement</li>
                <li>Les autorités publiques ou judiciaires lorsque la loi l'exige</li>
              </ul>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">6. Vos droits</h2>
              <p>
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul>
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité de vos données</li>
                <li>Droit d'opposition au traitement</li>
                <li>Droit de retirer votre consentement à tout moment</li>
                <li>Droit d'introduire une réclamation auprès d'une autorité de contrôle</li>
              </ul>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter à l'adresse : privacy@emotionscare.com
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">7. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger 
                vos données personnelles contre la perte, l'accès non autorisé, la divulgation, l'altération ou la destruction.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Modifications de la politique de confidentialité</h2>
              <p>
                Nous pouvons modifier cette politique de confidentialité à tout moment. La version mise à jour sera publiée 
                sur notre site web avec la date de dernière mise à jour.
              </p>
              <p>
                Nous vous encourageons à consulter régulièrement notre politique de confidentialité pour rester informé 
                de la manière dont nous protégeons vos données.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default PrivacyPage;
