
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Page de Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Cette page de test fonctionne correctement.</p>
          <div className="space-y-2">
            <p>✅ React fonctionne</p>
            <p>✅ Router fonctionne</p>
            <p>✅ UI Components fonctionnent</p>
            <p>✅ Tailwind CSS fonctionne</p>
          </div>
          <div className="mt-6">
            <Button asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPage;
