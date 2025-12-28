import React from 'react';
import { Card } from '@/components/ui/card';

const TeamStatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Average emotion score widget */}
      <Card className="p-4 rounded-2xl shadow-sm">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Score émotionnel moyen</h4>
        <p className="text-3xl font-bold">68%</p>
        <span className="text-sm text-emerald-600 flex items-center">
          ↑ +4% par rapport à la période précédente
        </span>
      </Card>

      {/* At-risk percentage widget */}
      <Card className="p-4 rounded-2xl shadow-sm">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Collaborateurs à risque</h4>
        <p className="text-3xl font-bold">12%</p>
        <span className="text-sm text-rose-600 flex items-center">
          ↑ +2% par rapport à la période précédente
        </span>
      </Card>

      {/* Check-ins widget */}
      <Card className="p-4 rounded-2xl shadow-sm">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Scans réalisés</h4>
        <p className="text-3xl font-bold">42</p>
        <span className="text-sm text-emerald-600 flex items-center">
          ↑ +8 par rapport à la période précédente
        </span>
      </Card>
    </div>
  );
};

export default TeamStatCards;
