
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EmotionalClimateCard: React.FC = () => {
  return (
    <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Ambiance Générale
        </CardTitle>
        <CardDescription>Score émotionnel moyen et volume de check-ins</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Score moyen</p>
            <p className="text-3xl font-bold text-primary">78<span className="text-base">/100</span></p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Check-ins total</p>
            <p className="text-3xl font-bold text-primary">143</p>
          </div>
        </div>
        <div className="border rounded-xl p-4">
          <p className="text-sm font-medium mb-2">Notes et observations</p>
          <textarea 
            className="w-full h-[120px] border rounded-lg p-2 text-sm" 
            placeholder="Ajoutez vos observations sur l'ambiance générale ici..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalClimateCard;
