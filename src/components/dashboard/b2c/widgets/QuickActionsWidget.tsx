// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Music, MessageCircle, Camera, Calendar, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActionsWidget: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { title: 'Scan Émotionnel', icon: Activity, path: '/scan', color: 'bg-blue-500' },
    { title: 'Musique', icon: Music, path: '/music', color: 'bg-purple-500' },
    { title: 'Coach IA', icon: MessageCircle, path: '/coach', color: 'bg-green-500' },
    { title: 'Journal', icon: Book, path: '/journal', color: 'bg-orange-500' },
    { title: 'Réalité Virtuelle', icon: Camera, path: '/vr', color: 'bg-indigo-500' },
    { title: 'Événements', icon: Calendar, path: '/events', color: 'bg-red-500' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate(action.path)}
            >
              <div className={`${action.color} p-2 rounded-full text-white`}>
                <action.icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-center">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
