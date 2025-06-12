import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Puzzle, Zap, Shield } from 'lucide-react';

const ExtensionsPage = () => {
  const [extensions, setExtensions] = useState([
    {
      id: 1,
      name: "Analytics Plus",
      description: "Analyses avancées et rapports personnalisés",
      enabled: true,
      category: "Analytics",
      icon: Zap,
      status: "Actif"
    },
    {
      id: 2,
      name: "GDPR Compliance",
      description: "Conformité RGPD automatisée",
      enabled: true,
      category: "Sécurité",
      icon: Shield,
      status: "Actif"
    },
    {
      id: 3,
      name: "Team Insights",
      description: "Indicateurs d'équipe en temps réel",
      enabled: false,
      category: "RH",
      icon: Puzzle,
      status: "Disponible"
    }
  ]);

  const toggleExtension = (id: number) => {
    setExtensions(prev => 
      prev.map(ext => 
        ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
      )
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Analytics: "bg-blue-100 text-blue-800",
      Sécurité: "bg-red-100 text-red-800",
      RH: "bg-green-100 text-green-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Extensions</h1>
        <p className="text-muted-foreground">
          Gérer les extensions et modules complémentaires
        </p>
      </div>

      <div className="grid gap-4">
        {extensions.map((extension) => {
          const Icon = extension.icon;
          return (
            <Card key={extension.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{extension.name}</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={getCategoryColor(extension.category)}
                  >
                    {extension.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {extension.status}
                  </span>
                  <Switch
                    checked={extension.enabled}
                    onCheckedChange={() => toggleExtension(extension.id)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {extension.description}
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Configurer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExtensionsPage;