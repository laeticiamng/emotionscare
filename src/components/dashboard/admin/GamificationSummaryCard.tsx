
import React from 'react';
import { Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const GamificationSummaryCard: React.FC = () => {
  return (
    <Card className="md:col-span-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Synthèse Gamification
        </CardTitle>
        <CardDescription>Engagement et récompenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
            <p className="text-3xl font-bold text-primary">87<span className="text-base">%</span></p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Badges distribués</p>
            <p className="text-3xl font-bold text-primary">214</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Défis complétés</p>
            <p className="text-3xl font-bold text-primary">532</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Streak moyen</p>
            <p className="text-3xl font-bold text-primary">4.7</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationSummaryCard;
