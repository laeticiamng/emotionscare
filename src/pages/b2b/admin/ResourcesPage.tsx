import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResourcesPage = () => {
  const resources = [
    {
      id: 1,
      title: "Guide de déploiement B2B",
      description: "Documentation complète pour le déploiement en entreprise",
      type: "PDF",
      size: "2.4 MB",
      icon: FileText
    },
    {
      id: 2,
      title: "Formation équipes RH",
      description: "Modules de formation pour les responsables RH",
      type: "Vidéo",
      size: "450 MB",
      icon: Book
    },
    {
      id: 3,
      title: "API Documentation",
      description: "Documentation technique des APIs",
      type: "HTML",
      size: "1.2 MB",
      icon: ExternalLink
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ressources</h1>
        <p className="text-muted-foreground">
          Centre de ressources et documentation pour les administrateurs
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Icon className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-base">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {resource.type} • {resource.size}
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Télécharger
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

export default ResourcesPage;