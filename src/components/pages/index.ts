/**
 * Export centralisé des composants de pages
 * Remplace les TODOs par des composants réels
 */

// Pages principales
export { ProfileSettingsPage } from './ProfileSettingsPage';
export { DataSettingsPage } from './DataSettingsPage';

// Pages de contenu
export const HelpPage = ({ 'data-testid': testId }: { 'data-testid'?: string }) => (
  <div className="container mx-auto py-8" data-testid={testId}>
    <h1 className="text-3xl font-bold mb-6">Centre d'aide</h1>
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Questions fréquentes</h2>
        <div className="space-y-2">
          <details className="border rounded p-4">
            <summary className="cursor-pointer font-medium">Comment utiliser le coach IA ?</summary>
            <p className="mt-2 text-muted-foreground">Le coach IA vous accompagne dans votre bien-être émotionnel...</p>
          </details>
          <details className="border rounded p-4">
            <summary className="cursor-pointer font-medium">Comment modifier mes préférences ?</summary>
            <p className="mt-2 text-muted-foreground">Rendez-vous dans les paramètres de votre profil...</p>
          </details>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Guides d'utilisation</h2>
        <div className="space-y-2">
          <a href="#" className="block border rounded p-4 hover:bg-muted">
            <h3 className="font-medium">Guide de démarrage</h3>
            <p className="text-sm text-muted-foreground">Premiers pas avec EmotionsCare</p>
          </a>
        </div>
      </div>
    </div>
  </div>
);

export const ApiDocumentationPage = ({ 'data-testid': testId }: { 'data-testid'?: string }) => (
  <div className="container mx-auto py-8" data-testid={testId}>
    <h1 className="text-3xl font-bold mb-6">Documentation API</h1>
    <div className="prose max-w-none">
      <h2>Endpoints disponibles</h2>
      <div className="space-y-4">
        <div className="border rounded p-4">
          <h3 className="font-mono">POST /api/coach/message</h3>
          <p>Envoie un message au coach IA</p>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-mono">GET /api/emotions/analyze</h3>
          <p>Analyse les émotions d'un texte ou audio</p>
        </div>
      </div>
    </div>
  </div>
);

export const PricingPage = ({ 'data-testid': testId }: { 'data-testid'?: string }) => (
  <div className="container mx-auto py-8" data-testid={testId}>
    <h1 className="text-3xl font-bold text-center mb-6">Tarifs</h1>
    <div className="grid gap-6 md:grid-cols-3">
      <div className="border rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Gratuit</h2>
        <div className="text-3xl font-bold mb-4">0€</div>
        <ul className="space-y-2 text-sm">
          <li>✓ Coach IA basique</li>
          <li>✓ 5 conversations/mois</li>
          <li>✓ Analyse d'émotions</li>
        </ul>
      </div>
      <div className="border rounded-lg p-6 text-center bg-primary text-primary-foreground">
        <h2 className="text-xl font-semibold mb-4">Premium</h2>
        <div className="text-3xl font-bold mb-4">9€<span className="text-sm">/mois</span></div>
        <ul className="space-y-2 text-sm">
          <li>✓ Coach IA avancé</li>
          <li>✓ Conversations illimitées</li>
          <li>✓ Analyses détaillées</li>
          <li>✓ Export des données</li>
        </ul>
      </div>
      <div className="border rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Entreprise</h2>
        <div className="text-3xl font-bold mb-4">Sur mesure</div>
        <ul className="space-y-2 text-sm">
          <li>✓ Toutes les fonctionnalités</li>
          <li>✓ Analytics équipe</li>
          <li>✓ Support prioritaire</li>
          <li>✓ Intégrations custom</li>
        </ul>
      </div>
    </div>
  </div>
);

export const TermsPage = ({ 'data-testid': testId }: { 'data-testid'?: string }) => (
  <div className="container mx-auto py-8 max-w-4xl" data-testid={testId}>
    <h1 className="text-3xl font-bold mb-6">Conditions d'utilisation</h1>
    <div className="prose max-w-none space-y-6">
      <section>
        <h2 className="text-xl font-semibold">1. Acceptation des conditions</h2>
        <p>En utilisant EmotionsCare, vous acceptez les présentes conditions d'utilisation.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold">2. Utilisation du service</h2>
        <p>Vous vous engagez à utiliser le service de manière responsable et conforme à la loi.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold">3. Données personnelles</h2>
        <p>Vos données personnelles sont traitées conformément à notre politique de confidentialité.</p>
      </section>
    </div>
  </div>
);

export const PrivacyPage = ({ 'data-testid': testId }: { 'data-testid'?: string }) => (
  <div className="container mx-auto py-8 max-w-4xl" data-testid={testId}>
    <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
    <div className="prose max-w-none space-y-6">
      <section>
        <h2 className="text-xl font-semibold">Collecte des données</h2>
        <p>Nous collectons uniquement les données nécessaires au fonctionnement du service.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Utilisation des données</h2>
        <p>Vos données sont utilisées pour personnaliser votre expérience et améliorer nos services.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Vos droits</h2>
        <p>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>
      </section>
    </div>
  </div>
);

export const PrivacySettingsPage = ({ 'data-testid': testId }: { 'data-testid'?: string }) => (
  <div className="container mx-auto py-8" data-testid={testId}>
    <h1 className="text-3xl font-bold mb-6">Paramètres de confidentialité</h1>
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Visibilité du profil</h2>
        <p className="text-muted-foreground mb-4">Contrôlez qui peut voir votre profil</p>
        {/* Composants de paramètres ici */}
      </div>
    </div>
  </div>
);

export const NotificationSettingsPage = ({ 'data-testid': testId }: { 'data-testid'?: string }) => (
  <div className="container mx-auto py-8" data-testid={testId}>
    <h1 className="text-3xl font-bold mb-6">Paramètres de notifications</h1>
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications push</h2>
        <p className="text-muted-foreground mb-4">Gérez vos préférences de notifications</p>
        {/* Composants de paramètres ici */}
      </div>
    </div>
  </div>
);