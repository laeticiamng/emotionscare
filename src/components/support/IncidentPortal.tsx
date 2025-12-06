// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';

interface Incident {
  id: string;
  message: string;
  date: string;
}

/**
 * Simple incident portal allowing to report and list incidents.
 * This is a lightweight placeholder until real backend integration.
 */
const IncidentPortal: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIncidents([{ id: uuidv4(), message, date: new Date().toISOString() }, ...incidents]);
    setMessage('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidents récents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Décrire un incident..."
          />
          <Button type="submit">Signaler</Button>
        </form>
        <ul className="space-y-2 text-sm">
          {incidents.map((inc) => (
            <li key={inc.id} className="flex items-center justify-between">
              <span>{inc.message}</span>
              <span className="text-muted-foreground text-xs">
                {new Date(inc.date).toLocaleString()}
              </span>
            </li>
          ))}
          {incidents.length === 0 && (
            <li className="text-muted-foreground">Aucun incident signalé.</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default IncidentPortal;
