import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Music, MessageCircle } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EmotionsCare
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Plateforme premium de bien-être émotionnel avec IA, analyse d'émotions en temps réel et musicothérapie personnalisée
          </p>
          <Button size="lg" className="mr-4">
            Commencer l'analyse
          </Button>
          <Button variant="outline" size="lg">
            En savoir plus
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-10 w-10 text-blue-600 mb-4" />
              <CardTitle>Analyse IA</CardTitle>
              <CardDescription>
                Scanner d'émotions avec intelligence artificielle avancée
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-10 w-10 text-pink-600 mb-4" />
              <CardTitle>Suivi Émotionnel</CardTitle>
              <CardDescription>
                Monitoring en temps réel de votre état émotionnel
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Music className="h-10 w-10 text-purple-600 mb-4" />
              <CardTitle>Musicothérapie</CardTitle>
              <CardDescription>
                Playlists thérapeutiques personnalisées selon vos émotions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageCircle className="h-10 w-10 text-green-600 mb-4" />
              <CardTitle>Coach IA</CardTitle>
              <CardDescription>
                Accompagnement personnalisé par intelligence artificielle
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">
            ✨ Plateforme mise à jour avec les dernières technologies Lovable
          </p>
        </div>
      </div>
    </div>
  );
}