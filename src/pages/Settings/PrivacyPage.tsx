import React from 'react';
import Shell from '@/Shell';
import { PrivacyToggle } from '@/components/privacy/PrivacyToggle';
import { ExportButton } from '@/components/rgpd/ExportButton';

const PrivacyPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-6 max-w-4xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold mb-2">Confidentialité</h1>
          <p className="text-muted-foreground">
            Gère tes données et autorisations
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <PrivacyToggle />
          </div>
          
          <div>
            <ExportButton />
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default PrivacyPage;