// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Brain, Settings, SparkleIcon } from 'lucide-react';
import { usePredictiveIntelligence } from '@/hooks/usePredictiveIntelligence';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PredictiveFeatureListProps {
  className?: string;
  userMode?: 'b2c' | 'b2b' | 'b2b-admin';
  collapsible?: boolean;
}

const PredictiveFeatureList: React.FC<PredictiveFeatureListProps> = ({
  className,
  userMode = 'b2c',
  collapsible = true
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { availableFeatures, predictionEnabled, setPredictionEnabled } = usePredictiveIntelligence(userMode);
  
  // Group features by priority
  const highPriorityFeatures = availableFeatures.filter(feature => feature.priority >= 8);
  const standardFeatures = availableFeatures.filter(feature => feature.priority < 8);
  
  if (isCollapsed) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <SparkleIcon className="h-5 w-5 text-primary" />
              Intelligence prédictive
            </CardTitle>
            {collapsible && (
              <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(false)}>
                Afficher
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <SparkleIcon className="h-5 w-5 text-primary" />
            Intelligence prédictive
          </CardTitle>
          {collapsible && (
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(true)}>
              Masquer
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Intelligence prédictive globale</h3>
              <p className="text-sm text-muted-foreground">
                Activez toutes les fonctionnalités prédictives
              </p>
            </div>
          </div>
          <Switch 
            checked={predictionEnabled} 
            onCheckedChange={setPredictionEnabled}
          />
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5">Premium</Badge>
            Fonctionnalités prioritaires
          </h3>
          
          {highPriorityFeatures.map(feature => (
            <div 
              key={feature.name}
              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/20 transition-colors"
            >
              <div>
                <h4 className="text-sm font-medium">{feature.name}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
              <Switch 
                checked={feature.enabled} 
                onCheckedChange={feature.toggleFeature}
                disabled={!predictionEnabled}
              />
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium">Fonctionnalités standard</h3>
          
          {standardFeatures.map(feature => (
            <div 
              key={feature.name}
              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/20 transition-colors"
            >
              <div>
                <h4 className="text-sm font-medium">{feature.name}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
              <Switch 
                checked={feature.enabled} 
                onCheckedChange={feature.toggleFeature}
                disabled={!predictionEnabled}
              />
            </div>
          ))}
        </div>
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center justify-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Paramètres avancés
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveFeatureList;
