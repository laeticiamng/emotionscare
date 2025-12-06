// @ts-nocheck

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const PrivacyConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous acceptez notre politique de confidentialité.
        </div>
        <div className="flex gap-2 ml-4">
          <Button variant="outline" size="sm" onClick={() => setIsVisible(false)}>
            Accepter
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyConsentBanner;
