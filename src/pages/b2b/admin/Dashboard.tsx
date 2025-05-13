
import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BAdminDashboard: React.FC = () => {
  const { setUserMode } = useUserMode();
  
  // Ensure the user mode is set correctly
  React.useEffect(() => {
    setUserMode('b2b-admin');
  }, [setUserMode]);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord Administration</h1>
      <p className="text-muted-foreground mb-4">
        Visualisez les données agrégées de bien-être et de performance de vos équipes.
      </p>
      
      {/* Content to be implemented */}
      <div className="p-8 text-center text-muted-foreground">
        Contenu du tableau de bord pour le profil administrateur (B2B Admin)
      </div>
    </div>
  );
};

export default B2BAdminDashboard;
