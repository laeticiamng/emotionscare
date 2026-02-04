/**
 * DashboardWidgetBuilder - Constructeur de widgets personnalisés
 * Permet aux utilisateurs de créer leur propre dashboard
 */

import React, { useState, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, Trash2, Move, Settings, Eye, EyeOff,
  BarChart3, PieChart, LineChart, Activity, Heart,
  Brain, Zap, Moon, TrendingUp, Calendar, Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Widget {
  id: string;
  type: 'mood' | 'activity' | 'streak' | 'goals' | 'chart' | 'stats';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  visible: boolean;
  config: Record<string, unknown>;
}

const WIDGET_TEMPLATES = [
  { type: 'mood', title: 'Humeur du jour', icon: Heart, color: 'bg-pink-500' },
  { type: 'activity', title: 'Activité récente', icon: Activity, color: 'bg-green-500' },
  { type: 'streak', title: 'Série en cours', icon: Zap, color: 'bg-yellow-500' },
  { type: 'goals', title: 'Objectifs', icon: Target, color: 'bg-blue-500' },
  { type: 'chart', title: 'Évolution', icon: LineChart, color: 'bg-purple-500' },
  { type: 'stats', title: 'Statistiques', icon: BarChart3, color: 'bg-indigo-500' },
] as const;

const DashboardWidgetBuilder: React.FC = memo(() => {
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '1', type: 'mood', title: 'Humeur du jour', size: 'medium', position: { x: 0, y: 0 }, visible: true, config: {} },
    { id: '2', type: 'streak', title: 'Série en cours', size: 'small', position: { x: 1, y: 0 }, visible: true, config: {} },
    { id: '3', type: 'chart', title: 'Évolution hebdomadaire', size: 'large', position: { x: 0, y: 1 }, visible: true, config: {} },
  ]);
  const [editMode, setEditMode] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  const addWidget = useCallback((type: typeof WIDGET_TEMPLATES[number]['type']) => {
    const template = WIDGET_TEMPLATES.find(t => t.type === type);
    if (!template) return;
    
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: template.title,
      size: 'medium',
      position: { x: 0, y: widgets.length },
      visible: true,
      config: {}
    };
    
    setWidgets(prev => [...prev, newWidget]);
    toast({
      title: 'Widget ajouté',
      description: `${template.title} a été ajouté à votre dashboard`
    });
  }, [widgets.length, toast]);

  const removeWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
    toast({ title: 'Widget supprimé' });
  }, [toast]);

  const toggleVisibility = useCallback((id: string) => {
    setWidgets(prev => prev.map(w => 
      w.id === id ? { ...w, visible: !w.visible } : w
    ));
  }, []);

  const updateWidgetSize = useCallback((id: string, size: Widget['size']) => {
    setWidgets(prev => prev.map(w => 
      w.id === id ? { ...w, size } : w
    ));
  }, []);

  const renderWidgetPreview = (widget: Widget) => {
    const template = WIDGET_TEMPLATES.find(t => t.type === widget.type);
    const Icon = template?.icon || BarChart3;
    
    return (
      <div className={`p-4 rounded-lg bg-muted/50 ${
        widget.size === 'small' ? 'col-span-1' : 
        widget.size === 'medium' ? 'col-span-2' : 'col-span-3'
      } ${!widget.visible ? 'opacity-50' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded ${template?.color || 'bg-primary'}`}>
              {React.createElement(Icon, { className: "h-3 w-3 text-white" })}
            </div>
            <span className="font-medium text-sm">{widget.title}</span>
          </div>
          {editMode && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => toggleVisibility(widget.id)}
                aria-label={widget.visible ? 'Masquer' : 'Afficher'}
              >
                {widget.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setSelectedWidget(widget.id)}
                aria-label="Configurer"
              >
                <Settings className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive"
                onClick={() => removeWidget(widget.id)}
                aria-label="Supprimer"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <div className="h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
          Aperçu du widget
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Constructeur de Dashboard
            </CardTitle>
            <CardDescription>Personnalisez votre tableau de bord</CardDescription>
          </div>
          <Button
            variant={editMode ? 'default' : 'outline'}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Terminé' : 'Modifier'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Widget Palette */}
        {editMode && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Ajouter un widget</h4>
            <div className="flex flex-wrap gap-2">
              {WIDGET_TEMPLATES.map(template => (
                <Button
                  key={template.type}
                  variant="outline"
                  size="sm"
                  onClick={() => addWidget(template.type)}
                  className="flex items-center gap-2"
                >
                  {React.createElement(template.icon, { className: "h-4 w-4" })}
                  {template.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Widget Grid */}
        <div className="grid grid-cols-3 gap-4">
          {widgets.map(widget => (
            <React.Fragment key={widget.id}>
              {renderWidgetPreview(widget)}
            </React.Fragment>
          ))}
        </div>

        {/* Widget Config Modal */}
        {selectedWidget && (
          <div className="p-4 border rounded-lg bg-background">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Configuration du widget</h4>
              <Button variant="ghost" size="sm" onClick={() => setSelectedWidget(null)}>
                Fermer
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="widget-title">Titre</Label>
                <Input 
                  id="widget-title"
                  value={widgets.find(w => w.id === selectedWidget)?.title || ''}
                  onChange={(e) => setWidgets(prev => prev.map(w => 
                    w.id === selectedWidget ? { ...w, title: e.target.value } : w
                  ))}
                />
              </div>
              <div>
                <Label>Taille</Label>
                <div className="flex gap-2 mt-1">
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <Button
                      key={size}
                      variant={widgets.find(w => w.id === selectedWidget)?.size === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateWidgetSize(selectedWidget, size)}
                    >
                      {size === 'small' ? 'Petit' : size === 'medium' ? 'Moyen' : 'Grand'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{widgets.length} widgets</span>
          <span>{widgets.filter(w => w.visible).length} visibles</span>
        </div>
      </CardContent>
    </Card>
  );
});

DashboardWidgetBuilder.displayName = 'DashboardWidgetBuilder';

export default DashboardWidgetBuilder;
