import { Camera, Mic, Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrivacy } from "@/core/privacy";

interface PrivacyGateProps {
  capteur: "cam" | "mic" | "hr" | "push";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const sensorConfig = {
  cam: {
    icon: Camera,
    title: "Accès caméra requis",
    description: "Cette fonctionnalité nécessite l'accès à votre caméra pour analyser vos expressions faciales.",
    actionText: "Autoriser la caméra"
  },
  mic: {
    icon: Mic,
    title: "Accès microphone requis", 
    description: "Cette fonctionnalité nécessite l'accès à votre microphone pour l'analyse vocale.",
    actionText: "Autoriser le microphone"
  },
  hr: {
    icon: Heart,
    title: "Capteur cardiaque requis",
    description: "Cette fonctionnalité nécessite l'accès aux données de fréquence cardiaque.",
    actionText: "Activer le capteur"
  },
  push: {
    icon: Bell,
    title: "Notifications requises",
    description: "Cette fonctionnalité nécessite l'autorisation d'envoyer des notifications.",
    actionText: "Autoriser les notifications"
  }
};

export function PrivacyGate({ capteur, children, fallback }: PrivacyGateProps) {
  const privacy = usePrivacy();
  const { enableSensor } = usePrivacy();
  
  const isAuthorized = privacy[capteur] === true;
  
  if (isAuthorized) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const config = sensorConfig[capteur];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4" data-testid="page-root">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <CardTitle>{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => enableSensor(capteur)}
            className="w-full"
            size="lg"
          >
            {config.actionText}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Vos données restent privées et ne sont jamais stockées.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}