import { AsyncState } from "@/components/transverse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Building2, Users, BarChart3, Shield } from "lucide-react";

export default function EntreprisePage() {
  const navigate = useNavigate();

  const solutions = [
    {
      icon: Users,
      title: "Bien-être collectif",
      description: "Outils pour accompagner vos équipes au quotidien"
    },
    {
      icon: BarChart3,
      title: "Analytics RH", 
      description: "Tableau de bord agrégé (anonymat garanti)"
    },
    {
      icon: Shield,
      title: "Sécurité & conformité",
      description: "RGPD, sécurité des données, audit complet"
    }
  ];

  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Solutions Entreprise
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Accompagnez le bien-être émotionnel de vos collaborateurs
          </p>
        </div>

        <AsyncState.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {solutions.map((solution, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <solution.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>{solution.title}</CardTitle>
                  <CardDescription>{solution.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Features entreprise */}
          <Card className="mb-12">
            <CardHeader className="text-center">
              <CardTitle>Fonctionnalités clés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Pour vos collaborateurs</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Espace personnel privé</li>
                    <li>• Social Cocon entre collègues</li>
                    <li>• Outils de résilience quotidiens</li>
                    <li>• Respect de la vie privée</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pour vos managers</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Heatmap bien-être (anonymisée)</li>
                    <li>• Reports agrégés</li>
                    <li>• Organisation de pauses équipe</li>
                    <li>• Audit et sécurité</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Card className="inline-block p-6">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">Intéressé par nos solutions ?</h3>
                <p className="text-muted-foreground mb-4">
                  Découvrez comment EmotionsCare peut transformer le bien-être de vos équipes
                </p>
                <div className="space-x-4">
                  <Button onClick={() => navigate('/login')}>
                    Commencer l'essai
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/')}>
                    En savoir plus
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