
import React from 'react';
import B2BLandingPageComplete from '@/components/b2b/B2BLandingPageComplete';

const B2BLandingPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">EmotionsCare B2B</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Solutions Entreprise</h2>
            <p className="text-muted-foreground">
              Découvrez nos solutions de bien-être émotionnel pour vos équipes
            </p>
            {/* Interface B2B complète maintenant disponible */}
            <B2BLandingPageComplete />
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Commencer</h2>
            <p className="text-muted-foreground">
              Choisissez votre profil d'accès
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default B2BLandingPage;
