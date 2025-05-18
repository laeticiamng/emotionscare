import React from 'react';
import { Button } from '@/components/ui/button';
import { useExtensions } from '@/providers/ExtensionsProvider';

const ExtensionsPage: React.FC = () => {
  const { available, installed, toggleExtension } = useExtensions();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Marketplace d'extensions</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {available.map((ext) => (
          <div key={ext.id} className="border p-4 rounded-lg space-y-2">
            <h2 className="font-semibold text-lg">{ext.name}</h2>
            <p className="text-sm text-muted-foreground">{ext.description}</p>
            <Button
              onClick={() => toggleExtension(ext.id)}
              variant={installed.includes(ext.id) ? 'secondary' : 'default'}
            >
              {installed.includes(ext.id) ? 'Désinstaller' : 'Installer'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtensionsPage;
