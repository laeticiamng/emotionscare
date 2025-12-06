
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockReminders = [
  {
    id: '1',
    title: 'Session de méditation',
    time: '2025-05-13T10:00:00',
    completed: false
  },
  {
    id: '2',
    title: 'Scanner votre émotion',
    time: '2025-05-13T14:30:00',
    completed: false
  },
  {
    id: '3',
    title: 'Écrire dans le journal',
    time: '2025-05-13T19:00:00',
    completed: true
  }
];

const UpcomingReminders: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Rappels à venir</CardTitle>
        <Button variant="ghost" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockReminders.map((reminder) => (
            <div 
              key={reminder.id} 
              className={`flex items-center justify-between border-l-4 px-3 py-2 rounded ${
                reminder.completed 
                  ? 'border-muted bg-muted/30 text-muted-foreground' 
                  : 'border-primary bg-primary/5'
              }`}
            >
              <div className="flex items-center">
                {reminder.completed ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-muted-foreground" />
                ) : (
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                )}
                <div>
                  <p className={reminder.completed ? "line-through" : "font-medium"}>
                    {reminder.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(reminder.time).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
              
              {!reminder.completed && (
                <Button variant="ghost" size="sm">
                  Terminer
                </Button>
              )}
            </div>
          ))}
          
          {mockReminders.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p>Aucun rappel pour aujourd'hui</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingReminders;
