import { Heart, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function SimHRVariant() {
  const navigate = useNavigate();
  const [simulatedHR, setSimulatedHR] = useState(72);

  const adjustHR = (delta: number) => {
    setSimulatedHR(prev => Math.max(50, Math.min(150, prev + delta)));
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4" data-testid="page-root">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="relative mx-auto mb-4">
            <Heart className="h-12 w-12 text-red-500" />
            <Activity className="h-6 w-6 absolute -bottom-1 -right-1 text-primary" />
          </div>
          <CardTitle>Mode simulation cardiaque</CardTitle>
          <CardDescription>
            Le capteur cardiaque n'est pas disponible. Utilisez les contrôles manuels 
            pour simuler votre fréquence cardiaque.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary mb-2">
              {simulatedHR} BPM
            </div>
            <div className="flex justify-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => adjustHR(-5)}
              >
                -5
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => adjustHR(-1)}
              >
                -1
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => adjustHR(1)}
              >
                +1
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => adjustHR(5)}
              >
                +5
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/settings/privacy')}
              variant="outline"
              className="flex-1"
            >
              Activer le capteur
            </Button>
            <Button 
              onClick={() => navigate('/app/home')}
              className="flex-1"
            >
              Continuer en simulation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}