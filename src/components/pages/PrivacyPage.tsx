import React from 'react';

export const PrivacyPage: React.FC<{ 'data-testid'?: string }> = ({ 'data-testid': testId }) => {
  return (
    <div className="min-h-screen bg-background" data-testid={testId || "page-root"}>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Politique de confidentialité</h1>
        <div className="prose prose-lg max-w-4xl text-foreground">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Collecte des données</h2>
            <p className="mb-4">
              EmotionsCare collecte les données personnelles suivantes :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Informations de compte (email, nom, préférences)</li>
              <li>Données d'usage de l'application</li>
              <li>Données émotionnelles analysées (anonymisées)</li>
              <li>Données techniques (logs, performance)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Utilisation des données</h2>
            <p className="mb-4">Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Personnaliser votre expérience</li>
              <li>Améliorer nos services et algorithmes</li>
              <li>Fournir un support client</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Protection des données</h2>
            <p className="mb-4">
              Nous mettons en place des mesures de sécurité robustes :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Chiffrement des données en transit et au repos</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Audits de sécurité réguliers</li>
              <li>Conformité RGPD</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Vos droits RGPD</h2>
            <p className="mb-4">Vous avez le droit de :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier des données inexactes</li>
              <li>Supprimer vos données (droit à l'oubli)</li>
              <li>Limiter le traitement de vos données</li>
              <li>Portabilité de vos données</li>
              <li>Opposition au traitement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Partage des données</h2>
            <p className="mb-4">
              Nous ne vendons jamais vos données personnelles. Nous ne les partageons qu'avec :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Prestataires de services nécessaires (hébergement, analytics)</li>
              <li>Autorités légales si requis par la loi</li>
              <li>Partenaires avec votre consentement explicite</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Conservation des données</h2>
            <p className="mb-4">
              Nous conservons vos données aussi longtemps que nécessaire pour fournir nos services
              ou respecter nos obligations légales. Vous pouvez demander la suppression à tout moment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact et DPO</h2>
            <p className="mb-4">
              Pour exercer vos droits ou toute question sur la confidentialité :
            </p>
            <p className="mb-4">
              <strong>Contact :</strong> contact@emotionscare.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};