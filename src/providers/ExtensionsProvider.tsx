
import React, { createContext, useContext, useState } from 'react';

interface Extension {
  id: string;
  name: string;
  enabled: boolean;
}

interface ExtensionsContextType {
  extensions: Extension[];
  toggleExtension: (id: string) => void;
  isExtensionEnabled: (id: string) => boolean;
}

const ExtensionsContext = createContext<ExtensionsContextType>({
  extensions: [],
  toggleExtension: () => {},
  isExtensionEnabled: () => false
});

export const ExtensionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [extensions, setExtensions] = useState<Extension[]>([
    { id: 'music', name: 'Module Musical', enabled: true },
    { id: 'vr', name: 'Sessions VR', enabled: true },
    { id: 'emotion', name: 'Analyse Émotionnelle', enabled: true }
  ]);

  const toggleExtension = (id: string) => {
    setExtensions(prev => 
      prev.map(ext => 
        ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
      )
    );
  };

  const isExtensionEnabled = (id: string) => {
    return extensions.find(ext => ext.id === id)?.enabled || false;
  };

  return (
    <ExtensionsContext.Provider value={{ extensions, toggleExtension, isExtensionEnabled }}>
      {children}
    </ExtensionsContext.Provider>
  );
};

export const useExtensions = () => useContext(ExtensionsContext);
