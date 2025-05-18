import React, { useEffect, useState } from 'react';
import { innovationService } from '@/services/innovationService';
import { Experiment } from '@/types/innovation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const B2BAdminInnovationPage: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    innovationService
      .fetchExperiments()
      .then(data => setExperiments(data))
      .catch(err => {
        console.error('Innovation fetch error', err);
        setError('Erreur lors du chargement');
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Innovation Lab</h1>
      {error && <p className="text-red-500">{error}</p>}
      {experiments.length === 0 ? (
        <p className="text-muted-foreground">Aucune expérimentation en cours.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experiments.map(exp => (
            <Card key={exp.id} className="animate-fade-in">
              <CardHeader>
                <CardTitle>{exp.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">{exp.description}</p>
                <span className="text-sm">Statut : {exp.status}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default B2BAdminInnovationPage;
