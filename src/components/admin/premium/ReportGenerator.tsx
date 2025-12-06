import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const ReportGenerator: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Générateur de rapports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Générer des rapports personnalisés sur l'état émotionnel de votre équipe.</p>
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" /> Générer un rapport
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
