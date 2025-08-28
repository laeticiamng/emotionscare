import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onRetry }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          Aucune activité trouvée
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          Aucune activité ne correspond à vos critères de recherche. 
          Essayez de modifier les filtres ou la période sélectionnée.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          )}
          
          <Button variant="ghost" size="sm">
            Effacer les filtres
          </Button>
        </div>

        {/* Conseils */}
        <div className="mt-8 text-left max-w-md">
          <h4 className="text-sm font-medium mb-2">Conseils :</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Élargissez la période de recherche</li>
            <li>• Vérifiez l'orthographe des mots-clés</li>
            <li>• Désélectionnez certains modules</li>
            <li>• Utilisez des termes de recherche plus généraux</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};