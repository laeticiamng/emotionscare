
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ScanPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Scanner Émotionnel</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Page de scan émotionnel - À implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanPage;
