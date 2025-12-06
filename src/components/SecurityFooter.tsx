
import React from 'react';
import SecurityCertifications from './SecurityCertifications';

/**
 * Composant de pied de page avec informations de sécurité
 * Affiche les certifications et messages légaux avec un design cohérent
 */
const SecurityFooter: React.FC = () => {
  // Textes légaux centralisés pour éviter la duplication
  const legalMessages = [
    "ÉmotionsCare™ ne remplace pas un avis médical ou psychologique.",
    "Vos données sont utilisées conformément à notre politique de confidentialité.",
    "© 2025 EmotionsCare par ResiMax™. Tous droits réservés."
  ];

  return (
    <footer className="mt-auto pt-6 border-t">
      {/* Utilisation du composant de certifications une seule fois */}
      <SecurityCertifications />
      
      {/* Messages légaux */}
      <div className="text-center text-sm text-muted-foreground space-y-2 py-5 border-t">
        {legalMessages.map((message, index) => (
          <p key={`legal-${index}`}>{message}</p>
        ))}
      </div>
    </footer>
  );
};

export default SecurityFooter;
