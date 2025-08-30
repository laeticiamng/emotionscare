import { AsyncState } from "@/components/transverse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Settings, User, Shield, Bell, Database } from "lucide-react";

export default function GeneralPage() {
  const navigate = useNavigate();

  const settingsCategories = [
    {
      icon: User,
      title: "Profil",
      description: "Informations personnelles et préférences",
      path: "/settings/profile"
    },
    {
      icon: Shield,
      title: "Confidentialité", 
      description: "Capteurs, données et permissions",
      path: "/settings/privacy"
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Rappels et alertes personnalisés",
      path: "/settings/notifications"
    },
    {
      icon: Database,
      title: "Données",
      description: "Export RGPD et gestion des données",
      path: "/settings/data"
    }
  ];

  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/app/home')}
            className="mb-4"
          >
            ← Retour à l'accueil
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Paramètres
          </h1>
          <p className="text-muted-foreground">
            Personnalisez votre expérience EmotionsCare
          </p>
        </div>

        <AsyncState.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settingsCategories.map((category) => (
              <Card 
                key={category.path}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(category.path)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <category.icon className="h-6 w-6 text-primary" />
                    <CardTitle>{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Configurer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions rapides */}
          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h2 className="font-semibold mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/settings/privacy')}
              >
                Gérer les capteurs
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/settings/data')}
              >
                Exporter mes données
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/settings/notifications')}
              >
                Notifications
              </Button>
            </div>
          </div>
        </AsyncState.Content>
      </div>
    </main>
  );
}