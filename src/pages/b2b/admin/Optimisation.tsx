import React, { useEffect } from 'react';
import { useOptimization } from '@/providers/OptimizationProvider';
import { Button } from '@/components/ui/button';

const B2BAdminOptimisation: React.FC = () => {
  const { suggestions, generateSuggestions, isLoading } = useOptimization();

  useEffect(() => {
    generateSuggestions();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Optimisation continue</h1>
      <Button onClick={generateSuggestions} disabled={isLoading} className="mb-4">
        Actualiser
      </Button>
      <ul className="space-y-2">
        {suggestions.map((s) => (
          <li key={s.id} className="border p-4 rounded-lg">
            <p className="font-medium">{s.module}</p>
            <p className="text-sm text-muted-foreground">{s.description}</p>
          </li>
        ))}
        {suggestions.length === 0 && !isLoading && (
          <li className="text-muted-foreground">Aucune suggestion pour le moment.</li>
        )}
      </ul>
    </div>
  );
};

export default B2BAdminOptimisation;
