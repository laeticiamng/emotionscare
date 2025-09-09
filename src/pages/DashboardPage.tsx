import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Heart, 
  Calendar,
  Navigation,
  Zap,
  Layout,
  Brain,
  Music,
  MessageSquare,
  Eye
} from 'lucide-react';
import UnifiedDashboard from '@/components/features/UnifiedDashboard';
import NavigationHub from '@/components/features/NavigationHub';
import EmotionAnalysisEngine from '@/components/core/emotion/EmotionAnalysisEngine';
import MusicTherapyEngine from '@/components/core/music/MusicTherapyEngine';
import VirtualCoachEngine from '@/components/core/coaching/VirtualCoachEngine';

const DashboardPage: React.FC = () => {
  const [activeView, setActiveView] = React.useState<'unified' | 'navigation' | 'emotion' | 'music' | 'coach'>('unified');

  const views = [
    { key: 'unified', label: 'Vue Unifiée', icon: Layout, component: UnifiedDashboard },
    { key: 'navigation', label: 'Navigation', icon: Navigation, component: NavigationHub },
    { key: 'emotion', label: 'Analyse IA', icon: Brain, component: EmotionAnalysisEngine },
    { key: 'music', label: 'Musicothérapie', icon: Music, component: MusicTherapyEngine },
    { key: 'coach', label: 'Coach IA', icon: MessageSquare, component: VirtualCoachEngine }
  ];

  const currentView = views.find(v => v.key === activeView);
  const ViewComponent = currentView?.component || UnifiedDashboard;

  return (
    <div className="container mx-auto py-8 px-4" data-testid="page-root">
      {/* Header avec sélecteur de vue */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard Principal
          </h1>
          <p className="text-lg text-muted-foreground">
            Centre de contrôle de votre bien-être émotionnel
          </p>
        </div>
        
        {/* Sélecteur de vue étendu */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {views.map((view) => (
            <Button
              key={view.key}
              variant={activeView === view.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView(view.key as any)}
              className="flex items-center gap-2 text-sm"
            >
              <view.icon className="h-4 w-4" />
              {view.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Badge du module actuel */}
      <div className="mb-6">
        <Badge variant="outline" className="flex items-center gap-2 w-fit">
          {currentView && <currentView.icon className="h-4 w-4" />}
          {currentView?.label}
          <Zap className="h-3 w-3" />
        </Badge>
      </div>

      {/* Contenu dynamique */}
      <ViewComponent />
    </div>
  );
};

export default DashboardPage;