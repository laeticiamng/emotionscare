
import React, { useState } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Plus, Eye, EyeOff } from 'lucide-react';
import { DraggableWidget } from './DraggableWidget';
import { EmotionalStatsWidget } from './widgets/EmotionalStatsWidget';
import { QuickActionsWidget } from './widgets/QuickActionsWidget';
import { RecentActivityWidget } from './widgets/RecentActivityWidget';
import { GoalsProgressWidget } from './widgets/GoalsProgressWidget';
import { WeatherMoodWidget } from './widgets/WeatherMoodWidget';
import { RecommendationsWidget } from './widgets/RecommendationsWidget';

interface Widget {
  id: string;
  type: string;
  title: string;
  visible: boolean;
  position: number;
}

const PersonalizableDashboard: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'emotional-stats', type: 'emotional-stats', title: 'Statistiques Émotionnelles', visible: true, position: 0 },
    { id: 'quick-actions', type: 'quick-actions', title: 'Actions Rapides', visible: true, position: 1 },
    { id: 'recent-activity', type: 'recent-activity', title: 'Activité Récente', visible: true, position: 2 },
    { id: 'goals-progress', type: 'goals-progress', title: 'Progression Objectifs', visible: true, position: 3 },
    { id: 'weather-mood', type: 'weather-mood', title: 'Humeur & Météo', visible: true, position: 4 },
    { id: 'recommendations', type: 'recommendations', title: 'Recommandations IA', visible: true, position: 5 },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, visible: !widget.visible }
        : widget
    ));
  };

  const renderWidget = (widget: Widget) => {
    if (!widget.visible) return null;

    const widgetContent = () => {
      switch (widget.type) {
        case 'emotional-stats':
          return <EmotionalStatsWidget />;
        case 'quick-actions':
          return <QuickActionsWidget />;
        case 'recent-activity':
          return <RecentActivityWidget />;
        case 'goals-progress':
          return <GoalsProgressWidget />;
        case 'weather-mood':
          return <WeatherMoodWidget />;
        case 'recommendations':
          return <RecommendationsWidget />;
        default:
          return <div>Widget non reconnu</div>;
      }
    };

    if (editMode) {
      return (
        <DraggableWidget key={widget.id} id={widget.id}>
          {widgetContent()}
        </DraggableWidget>
      );
    }

    return <div key={widget.id}>{widgetContent()}</div>;
  };

  const visibleWidgets = widgets.filter(w => w.visible).sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mon Tableau de Bord Personnel</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={editMode ? "default" : "outline"}
                size="sm"
                onClick={() => setEditMode(!editMode)}
              >
                <Settings className="h-4 w-4 mr-2" />
                {editMode ? 'Terminer' : 'Personnaliser'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {editMode && (
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium">Widgets disponibles :</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {widgets.map(widget => (
                  <Button
                    key={widget.id}
                    variant={widget.visible ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className="justify-start"
                  >
                    {widget.visible ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                    {widget.title}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Dashboard Widgets */}
      {editMode ? (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleWidgets.map(w => w.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleWidgets.map(renderWidget)}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleWidgets.map(renderWidget)}
        </div>
      )}
    </div>
  );
};

export default PersonalizableDashboard;
