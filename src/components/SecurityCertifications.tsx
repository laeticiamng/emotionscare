
import React from 'react';
import { Shield, Lock, FileCheck, Search, Mail, Check, Building, Home } from 'lucide-react';

/**
 * Composant affichant les certifications de sécurité avec une présentation élégante
 * Ce composant ne doit être utilisé qu'une fois dans l'application pour éviter les duplications
 */
const SecurityCertifications: React.FC = () => {
  // Données des certifications regroupées pour éviter les répétitions
  const certifications = [
    { icon: <Lock className="h-5 w-5 text-amber-500" />, label: "Chiffrement" },
    { icon: <Shield className="h-5 w-5 text-red-500" />, label: "Protection" },
    { icon: <FileCheck className="h-5 w-5 text-blue-600" />, label: "RGPD" },
    { icon: <Search className="h-5 w-5 text-gray-600" />, label: "Transparence" }
  ];
  
  // Certifications supplémentaires dans une seconde ligne
  const additionalCerts = [
    { icon: <Mail className="h-5 w-5 text-blue-400" />, label: "Confidentialité" },
    { icon: <Check className="h-5 w-5 text-green-500" />, label: "Conformité" },
    { icon: <Building className="h-5 w-5 text-gray-700" />, label: "Entreprise" },
    { icon: <Home className="h-5 w-5 text-orange-500" />, label: "Proximité" }
  ];

  // Informations de sécurité pour éviter la répétition dans divers composants
  const securityInfo = [
    {
      title: "Confidentialité & Sécurité",
      description: "chiffrement AES-256, RGPD compliant"
    },
    {
      title: "Ludique",
      description: "notifications douces, Daily Streak, badges"
    },
    {
      title: "Actionnable",
      description: "alertes prédictives, suggestions d'ateliers, reporting"
    }
  ];

  return (
    <div className="w-full py-6 px-4 flex flex-col items-center">
      <h3 className="text-lg font-medium mb-4 text-center">Certifications de Sécurité & Conformité</h3>
      
      {/* Première ligne de certifications */}
      <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
        {certifications.map((cert, index) => (
          <div 
            key={`cert-${index}`}
            className="flex items-center justify-center p-3 rounded-full border bg-background/50 shadow-sm hover:shadow-md transition-all"
            title={cert.label}
          >
            {cert.icon}
          </div>
        ))}
      </div>
      
      {/* Seconde ligne de certifications avec espacement */}
      <div className="flex flex-wrap justify-center gap-4 max-w-3xl mt-3 mb-6">
        {additionalCerts.map((cert, index) => (
          <div 
            key={`add-cert-${index}`}
            className="flex items-center justify-center p-3 rounded-full border bg-background/50 shadow-sm hover:shadow-md transition-all"
            title={cert.label}
          >
            {cert.icon}
          </div>
        ))}
      </div>
      
      {/* Grille d'informations de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {securityInfo.map((info, index) => (
          <div key={`info-${index}`} className="text-center">
            <h4 className="font-medium mb-2">{info.title}</h4>
            <p className="text-sm text-muted-foreground">{info.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityCertifications;
