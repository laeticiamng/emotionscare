
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const SecurityCertifications: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 justify-center">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Données protégées et sécurisées</span>
        </div>
        <div className="mt-3 flex items-center justify-center gap-4">
          <div className="text-xs text-muted-foreground border rounded-md px-2 py-1">RGPD</div>
          <div className="text-xs text-muted-foreground border rounded-md px-2 py-1">SSL</div>
          <div className="text-xs text-muted-foreground border rounded-md px-2 py-1">HIPAA</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityCertifications;
