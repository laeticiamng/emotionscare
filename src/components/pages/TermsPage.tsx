import React from 'react';

export const TermsPage: React.FC<{ 'data-testid'?: string }> = ({ 'data-testid': testId }) => {
  return (
    <div className="min-h-screen bg-background" data-testid={testId || "page-root"}>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Conditions générales d'utilisation</h1>
        <div className="prose prose-lg max-w-4xl text-foreground">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
            <p className="mb-4">
              En utilisant EmotionsCare, vous acceptez d'être lié par ces conditions d'utilisation.
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description du service</h2>
            <p className="mb-4">
              EmotionsCare est une plateforme de bien-être émotionnel qui utilise l'intelligence artificielle
              pour vous aider à comprendre et améliorer votre état émotionnel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Responsabilités de l'utilisateur</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Utiliser le service de manière appropriée et légale</li>
              <li>Protéger vos informations de connexion</li>
              <li>Respecter les autres utilisateurs</li>
              <li>Ne pas partager de contenu inapproprié</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
            <p className="mb-4">
              Tous les contenus, logos, et technologies d'EmotionsCare sont protégés par les droits
              de propriété intellectuelle. Toute reproduction non autorisée est interdite.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Limitation de responsabilité</h2>
            <p className="mb-4">
              EmotionsCare est un outil de bien-être et ne remplace pas un avis médical professionnel.
              Consultez un professionnel de santé pour tout problème médical ou psychologique.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Modifications des conditions</h2>
            <p className="mb-4">
              Nous nous réservons le droit de modifier ces conditions à tout moment.
              Les utilisateurs seront informés des changements importants.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
            <p className="mb-4">
              Pour toute question concernant ces conditions, contactez-nous à : contact@emotionscare.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};