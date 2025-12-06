
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface QuickAction {
  id: string;
  name: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  bgColor?: string;
}

const QuickActionLinks = () => {
  const quickActions: QuickAction[] = [
    {
      id: 'journal',
      name: 'Journal',
      href: '/journal',
      description: 'Notez vos émotions quotidiennes',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'music',
      name: 'Musique',
      href: '/music',
      description: 'Écoutez de la musique relaxante',
      bgColor: 'bg-green-100'
    },
    {
      id: 'coach',
      name: 'Coach',
      href: '/coach',
      description: 'Discutez avec votre coach',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'vr',
      name: 'VR',
      href: '/vr',
      description: 'Explorez des environnements VR',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Accès rapides</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <Link key={action.id} to={action.href} className="block">
            <Button
              variant="outline"
              className="w-full h-full flex flex-col items-center justify-center p-4 gap-2"
            >
              {action.icon && <div className="text-2xl">{action.icon}</div>}
              <span className="font-medium">{action.name}</span>
              {action.description && (
                <span className="text-xs text-muted-foreground text-center">
                  {action.description}
                </span>
              )}
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActionLinks;
