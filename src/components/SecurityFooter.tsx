
import React from 'react';
import SecurityCertifications from './SecurityCertifications';

/**
 * Composant de pied de page avec informations de sécurité
 * Affiche une seule instance des certifications et du disclaimer
 */
const SecurityFooter: React.FC = () => {
  return (
    <footer className="mt-auto pt-8 border-t">
      {/* Utilisation du composant de certifications */}
      <SecurityCertifications />
      
      {/* Messages légaux */}
      <div className="text-center text-sm text-muted-foreground space-y-2 py-6 border-t">
        <p>ÉmotionsCare™ ne remplace pas un avis médical ou psychologique.</p>
        <p>Vos données sont utilisées pour...</p>
        <p>© 2025 EmotionsCare par ResiMax™. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default SecurityFooter;
