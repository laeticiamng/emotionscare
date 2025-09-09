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
  Layout
} from 'lucide-react';
import UnifiedDashboard from '@/components/features/UnifiedDashboard';
import NavigationHub from '@/components/features/NavigationHub';

const DashboardPage: React.FC = () => {
  const [activeView, setActiveView] = React.useState<'unified' | 'navigation'>('unified');

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
        
        {/* Sélecteur de vue */}
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <Button
            variant={activeView === 'unified' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('unified')}
            className="flex items-center gap-2"
          >
            <Layout className="h-4 w-4" />
            Vue Unifiée
          </Button>
          <Button
            variant={activeView === 'navigation' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('navigation')}
            className="flex items-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            Navigation
          </Button>
        </div>
      </div>

      {/* Contenu conditionnel */}
      {activeView === 'unified' ? (
        <UnifiedDashboard />
      ) : (
        <NavigationHub />
      )}
    </div>
  );
};

export default DashboardPage;