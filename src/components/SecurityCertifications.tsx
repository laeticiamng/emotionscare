
import React from 'react';
import { Shield, Lock, FileCheck, Search, Mail, Check, Building, Home } from 'lucide-react';

/**
 * Composant affichant les certifications de sécurité avec une présentation élégante
 */
const SecurityCertifications: React.FC = () => {
  // Données des certifications
  const certifications = [
    { icon: <Lock className="h-5 w-5 text-amber-500" />, label: "Chiffrement" },
    { icon: <Shield className="h-5 w-5 text-red-500" />, label: "Protection" },
    { icon: <FileCheck className="h-5 w-5 text-blue-600" />, label: "RGPD" },
    { icon: <Search className="h-5 w-5 text-gray-600" />, label: "Transparence" },
    { icon: <Mail className="h-5 w-5 text-blue-400" />, label: "Confidentialité" },
    { icon: <Check className="h-5 w-5 text-green-500" />, label: "Conformité" },
    { icon: <Building className="h-5 w-5 text-gray-700" />, label: "Entreprise" },
    { icon: <Home className="h-5 w-5 text-orange-500" />, label: "Proximité" }
  ];

  return (
    <div className="w-full py-6 px-4 flex flex-col items-center">
      <h3 className="text-lg font-medium mb-6 text-center">Certifications de Sécurité & Conformité</h3>
      
      <div className="flex flex-wrap justify-center gap-4 mb-8 max-w-3xl">
        {certifications.map((cert, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center p-3 rounded-full border bg-background/50 shadow-sm hover:shadow-md transition-all"
            title={cert.label}
          >
            {cert.icon}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
        <div className="text-center">
          <h4 className="font-medium mb-2">Confidentialité & Sécurité</h4>
          <p className="text-sm text-muted-foreground">chiffrement AES-256, RGPD compliant</p>
        </div>
        
        <div className="text-center">
          <h4 className="font-medium mb-2">Ludique</h4>
          <p className="text-sm text-muted-foreground">notifications douces, Daily Streak, badges</p>
        </div>
        
        <div className="text-center">
          <h4 className="font-medium mb-2">Actionnable</h4>
          <p className="text-sm text-muted-foreground">alertes prédictives, suggestions d'ateliers, reporting</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityCertifications;
