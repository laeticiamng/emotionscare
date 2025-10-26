import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, TrendingUp, Heart, Zap } from 'lucide-react';

export default function VoiceAnalysisPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Analyse Vocale Avancée</h1>
        <p className="text-muted-foreground">
          Analysez vos émotions à travers votre voix avec l'IA
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">État émotionnel</h3>
          <p className="text-2xl font-bold">Positif</p>
          <p className="text-sm text-muted-foreground">Basé sur l'analyse vocale</p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">Niveau d'énergie</h3>
          <p className="text-2xl font-bold">Élevé</p>
          <p className="text-sm text-muted-foreground">Détecté dans votre voix</p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">Tendance</h3>
          <p className="text-2xl font-bold">↑ 12%</p>
          <p className="text-sm text-muted-foreground">Par rapport à hier</p>
        </Card>
      </div>

      <Card className="p-8 text-center space-y-6">
        <h3 className="text-xl font-semibold">Nouvelle analyse</h3>
        <p className="text-muted-foreground">
          Enregistrez votre voix pendant 30 secondes pour une analyse complète
        </p>
        <Button size="lg">
          <Mic className="mr-2 h-5 w-5" />
          Commencer l'analyse
        </Button>
      </Card>
    </div>
  );
}
