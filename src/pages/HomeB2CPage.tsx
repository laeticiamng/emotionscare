import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Sparkles } from 'lucide-react';

export default function HomeB2CPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            EmotionsCare B2C
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Prenez soin de votre bien-être émotionnel avec nos outils innovants
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-lg border bg-card">
              <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Scan Émotionnel</h3>
              <p className="text-sm text-muted-foreground">
                Analysez vos émotions en temps réel
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Coach IA</h3>
              <p className="text-sm text-muted-foreground">
                Accompagnement personnalisé 24/7
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Expériences VR</h3>
              <p className="text-sm text-muted-foreground">
                Immersion pour la relaxation
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-12">
            <Link to="/login">
              <Button size="lg">Se connecter</Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline">Créer un compte</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
