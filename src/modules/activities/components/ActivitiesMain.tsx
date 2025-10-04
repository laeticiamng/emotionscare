/**
 * Composant principal du module activities
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useActivities } from '../useActivities';
import { ActivityCard } from '../ui/ActivityCard';
import { ActivityFilters } from '../ui/ActivityFilters';
import { useState } from 'react';

export function ActivitiesMain() {
  const {
    activities,
    favorites,
    filters,
    status,
    error,
    toggleFavorite,
    setFilters
  } = useActivities({ autoLoad: true });

  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  if (status === 'loading') {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Chargement des activités...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Activités Bien-être
          </CardTitle>
        </CardHeader>
      </Card>

      <ActivityFilters filters={filters} onFiltersChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              Aucune activité trouvée avec ces critères
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isFavorite={favorites.includes(activity.id)}
              onToggleFavorite={() => toggleFavorite(activity.id)}
              onSelect={() => setSelectedActivity(activity.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ActivitiesMain;
