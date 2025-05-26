
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Shield, Eye } from 'lucide-react';

interface PersonalDataTabProps {
  className?: string;
}

const PersonalDataTab: React.FC<PersonalDataTabProps> = ({ className }) => {
  const dataCategories = [
    {
      category: 'Analyses émotionnelles',
      count: 45,
      lastUpdate: '2024-01-15',
      icon: Eye
    },
    {
      category: 'Sessions VR',
      count: 23,
      lastUpdate: '2024-01-14',
      icon: Shield
    },
    {
      category: 'Préférences musicales',
      count: 12,
      lastUpdate: '2024-01-13',
      icon: Download
    }
  ];

  return (
    <div className={className}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes données personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataCategories.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{item.category}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.count} entrées • Dernière mise à jour: {item.lastUpdate}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contrôle de confidentialité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h3 className="font-medium mb-2">Protection des données</h3>
              <p className="text-sm text-muted-foreground">
                Vos données sont chiffrées et stockées de manière sécurisée. 
                Vous gardez le contrôle total sur vos informations personnelles.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                Paramètres de confidentialité
              </Button>
              <Button variant="outline">
                Supprimer mes données
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalDataTab;
