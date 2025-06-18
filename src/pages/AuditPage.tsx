
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AuditPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Audit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Page Audit - Contenu à venir
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditPage;
