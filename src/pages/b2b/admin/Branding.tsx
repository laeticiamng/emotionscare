import React from 'react';
import BrandingManager from '@/components/branding/BrandingManager';

const B2BAdminBranding: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Branding & Communication</h1>
        <p className="text-muted-foreground">
          Gérez l'apparence de la marque et les communications immersives.
        </p>
      </div>
      <BrandingManager />
    </div>
  );
};

export default B2BAdminBranding;
