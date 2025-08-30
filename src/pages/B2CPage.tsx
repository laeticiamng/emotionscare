import { AsyncState } from "@/components/transverse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Heart, Music, Brain, Sparkles } from "lucide-react";

export default function B2CPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: "Mesure émotionnelle",
      description: "Scanning intelligent de votre état du moment"
    },
    {
      icon: Music,
      title: "Musique personnalisée", 
      description: "Sons apaisants créés pour vous"
    },
    {
      icon: Brain,
      title: "Coach IA bienveillant",
      description: "Guidance douce et personnalisée"
    },
    {
      icon: Sparkles,
      title: "Expériences immersives",
      description: "VR et relaxation profonde"
    }
  ];

  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Votre cocon personnel
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Un espace de bien-être émotionnel conçu pour vous accompagner au quotidien
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/login')}
            className="mb-8"
          >
            Créer mon espace
          </Button>
        </div>

        <AsyncState.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <feature.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Card className="inline-block p-6">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">Prêt à commencer ?</h3>
                <p className="text-muted-foreground mb-4">
                  Rejoignez des milliers d'utilisateurs qui prennent soin de leur bien-être émotionnel
                </p>
                <div className="space-x-4">
                  <Button onClick={() => navigate('/signup')}>
                    Créer mon compte
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/login')}>
                    Déjà membre ?
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </AsyncState.Content>
      </div>
    </main>
  );
}