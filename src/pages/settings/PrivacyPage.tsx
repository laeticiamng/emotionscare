import { AsyncState } from "@/components/transverse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { usePrivacy } from "@/core/privacy";
import { Camera, Mic, Heart, Bell } from "lucide-react";

export default function PrivacyPage() {
  const navigate = useNavigate();
  const privacy = usePrivacy();

  const sensors = [
    {
      key: "cam" as const,
      icon: Camera,
      title: "Caméra",
      description: "Pour les fonctionnalités de reconnaissance faciale et AR"
    },
    {
      key: "mic" as const, 
      icon: Mic,
      title: "Microphone",
      description: "Pour la dictée vocale et l'analyse de voix"
    },
    {
      key: "hr" as const,
      icon: Heart,
      title: "Fréquence cardiaque", 
      description: "Pour les exercices de cohérence cardiaque"
    },
    {
      key: "push" as const,
      icon: Bell,
      title: "Notifications",
      description: "Pour les rappels bien-être personnalisés"
    }
  ];

  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/settings/general')}
            className="mb-4"
          >
            ← Retour aux paramètres
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Confidentialité
          </h1>
          <p className="text-muted-foreground">
            Contrôlez l'accès à vos capteurs et données personnelles
          </p>
        </div>

        <AsyncState.Content>
          <div className="space-y-6">
            
            {/* Capteurs */}
            <Card>
              <CardHeader>
                <CardTitle>Capteurs et permissions</CardTitle>
                <CardDescription>
                  Activez uniquement les capteurs dont vous avez besoin.
                  Tous sont désactivés par défaut pour votre sécurité.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {sensors.map((sensor) => (
                  <div key={sensor.key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <sensor.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">
                          {sensor.title}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {sensor.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={privacy[sensor.key]}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          privacy.enableSensor(sensor.key);
                        } else {
                          privacy.disableSensor(sensor.key);
                        }
                      }}
                      aria-label={`Activer ${sensor.title}`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Informations importantes */}
            <Card>
              <CardHeader>
                <CardTitle>À propos de vos données</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    🔒 <strong>Aucune donnée sensible</strong> n'est stockée sans votre consentement explicite.
                  </p>
                  <p>
                    🎯 <strong>Données personnelles</strong> : uniquement pour personnaliser votre experience.
                  </p>
                  <p>
                    🏢 <strong>Données d'équipe</strong> : agrégées et anonymisées (minimum 5 personnes).
                  </p>
                  <p>
                    📤 <strong>Export RGPD</strong> disponible à tout moment dans Paramètres &gt; Données.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => navigate('/settings/general')}
              >
                Retour
              </Button>
              <Button 
                onClick={() => navigate('/settings/data')}
              >
                Gérer mes données
              </Button>
            </div>
          </div>
        </AsyncState.Content>
      </div>
    </main>
  );
}