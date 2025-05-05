
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SocialCocoonCard: React.FC = () => {
  return (
    <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Social Cocoon Agressif
        </CardTitle>
        <CardDescription>Statistiques du réseau social interne</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Publications totales</p>
            <p className="text-3xl font-bold text-primary">87</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Taux de modération</p>
            <p className="text-3xl font-bold text-orange-500">5<span className="text-base">%</span></p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-sm font-medium mb-2">Tags les plus utilisés</p>
          <div className="flex flex-wrap gap-2">
            {['#bienetre', '#entraide', '#pause', '#conseil', '#equipe', '#relaxation', '#motivation']
              .map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-white px-3 py-1 rounded-full text-sm" 
                  style={{ fontSize: `${Math.max(0.8, Math.random() * 0.3 + 0.8)}rem` }}
                >
                  {tag}
                </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialCocoonCard;
