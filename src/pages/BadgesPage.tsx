import { WellnessGamificationPanel } from '@/components/gamification/WellnessGamificationPanel';
import { WellnessStreakDisplay } from '@/components/gamification/WellnessStreakDisplay';
import { Card, CardContent } from '@/components/ui/card';

export default function BadgesPage() {
  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gamification Bien-être</h1>
              <p className="text-muted-foreground">
                Système d'énergie émotionnelle • Encourage l'auto-bienveillance
              </p>
            </div>
          </div>

          {/* Streak Header */}
          <Card>
            <CardContent className="pt-6">
              <WellnessStreakDisplay showCheckin />
            </CardContent>
          </Card>
        </header>

        {/* Main Gamification Panel */}
        <WellnessGamificationPanel />

        {/* Info Section */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="py-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">💜 Système d'Énergie Émotionnelle</h3>
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div>
                  <h4 className="font-medium mb-2">⚡ Comment ça marche ?</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• L'énergie se recharge naturellement (1 point/4h)</li>
                    <li>• Complète des quêtes pour gagner de l'énergie</li>
                    <li>• Utilise des boosts quand tu es bas en énergie</li>
                    <li>• Maintiens ta série quotidienne</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">✨ Points Harmonie</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Monnaie interne de bien-être</li>
                    <li>• Débloque des thèmes et musiques</li>
                    <li>• Accède à des analyses avancées</li>
                    <li>• Offre de l'énergie à tes amis</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
