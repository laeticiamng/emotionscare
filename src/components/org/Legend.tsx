import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

/**
 * Légende pour la heatmap RH avec couleurs daltonisme-friendly
 */
export const Legend: React.FC = () => {
  const legendItems = [
    {
      color: '#3B82F6',
      label: 'Calme',
      description: 'Équipe en mode repos/détente'
    },
    {
      color: '#10B981', 
      label: 'Stable',
      description: 'Équipe dans un état équilibré'
    },
    {
      color: '#F59E0B',
      label: 'Énergique', 
      description: 'Équipe dynamique et motivée'
    },
    {
      color: '#E5E7EB',
      label: 'N/A',
      description: 'Données indisponibles'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Info className="w-4 h-4" />
          Légende
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded border border-gray-200"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <p className="text-sm font-medium">
                {item.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}

        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Navigation :</strong> Utilisez les flèches du clavier pour naviguer dans la heatmap.
          </p>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          <strong>Confidentialité :</strong> Couleurs adaptées au daltonisme. 
          Seules les équipes de 5+ personnes sont visibles.
        </div>
      </CardContent>
    </Card>
  );
};