
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UnifiedActionButtons from '@/components/home/UnifiedActionButtons';

const ChooseModePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Choisir votre mode</CardTitle>
        </CardHeader>
        <CardContent>
          <UnifiedActionButtons />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChooseModePage;
