
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MeditationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Méditation</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Page de méditation - À implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationPage;
