import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AISuggestions: React.FC = () => {
  return (
    <div className="mt-8 p-5 border rounded-2xl bg-blue-50">
      <h4 className="text-lg font-medium mb-3">Propositions IA</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white">
          <h5 className="font-medium">Atelier respiration</h5>
          <p className="text-sm text-muted-foreground mb-3">Organiser une session de 15 min de respiration guidée</p>
          <Button size="sm" variant="outline" className="w-full">Planifier</Button>
        </Card>
        <Card className="p-4 bg-white">
          <h5 className="font-medium">Pause café collective</h5>
          <p className="text-sm text-muted-foreground mb-3">Proposer un moment de détente informel en équipe</p>
          <Button size="sm" variant="outline" className="w-full">Planifier</Button>
        </Card>
        <Card className="p-4 bg-white">
          <h5 className="font-medium">Sondage bien-être</h5>
          <p className="text-sm text-muted-foreground mb-3">Envoi d'un questionnaire anonyme sur les sources de stress</p>
          <Button size="sm" variant="outline" className="w-full">Créer</Button>
        </Card>
      </div>
    </div>
  );
};

export default AISuggestions;
