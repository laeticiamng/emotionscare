"use client";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOverrides, setOverride, clearOverride } from "@/lib/flags/rollout";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Settings, Zap } from "lucide-react";

const KNOWN_FLAGS = ["scores-v2", "new-audio-engine", "telemetry-opt-in"] as const;

const FLAG_DESCRIPTIONS: Record<typeof KNOWN_FLAGS[number], string> = {
  "scores-v2": "Active la nouvelle version du système de scores avec algorithme amélioré",
  "new-audio-engine": "Utilise le nouveau moteur audio avec meilleure performance",
  "telemetry-opt-in": "Permet la collecte de télémétrie pour améliorer l'expérience"
};

export default function AdminFlagsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ov, setOv] = React.useState<Record<string, boolean>>(getOverrides());
  const [isAdmin, setIsAdmin] = React.useState(false);

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      // In production, check user role from database
      // For now, check if user email contains 'admin' or check metadata
      if (!user) {
        navigate('/login');
        return;
      }

      const userIsAdmin =
        user.email?.includes('@admin.') ||
        user.user_metadata?.role === 'admin' ||
        user.app_metadata?.role === 'admin' ||
        import.meta.env.DEV; // Allow in development

      if (!userIsAdmin) {
        navigate('/');
        return;
      }

      setIsAdmin(true);
    };

    void checkAdminAccess();
  }, [user, navigate]);

  const setOn = React.useCallback((k: string) => {
    setOverride(k, true);
    setOv(getOverrides());
  }, []);

  const setOff = React.useCallback((k: string) => {
    setOverride(k, false);
    setOv(getOverrides());
  }, []);

  const reset = React.useCallback((k: string) => {
    clearOverride(k);
    setOv(getOverrides());
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" />
              Accès non autorisé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Cette page est réservée aux administrateurs uniquement.
            </p>
            <Button asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main aria-label="Admin Flags" className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <PageHeader
          title="Admin — Feature Flags"
          subtitle="Overrides locaux pour le développement et le test"
        />
        <Alert className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Ces modifications sont locales et temporaires. Elles n'affectent que votre session.
          </AlertDescription>
        </Alert>
      </div>

      <div className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Feature Flags
            </CardTitle>
            <CardDescription>
              Activez ou désactivez des fonctionnalités expérimentales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {KNOWN_FLAGS.map(k => {
                const currentValue = ov[k];
                const isOverridden = currentValue !== undefined;

                return (
                  <li
                    key={k}
                    className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="text-base">{k}</strong>
                          {isOverridden && (
                            <Badge variant="secondary" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Override actif
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {FLAG_DESCRIPTIONS[k]}
                        </p>
                      </div>
                      <div className="text-sm font-medium ml-4">
                        {currentValue === undefined ? (
                          <Badge variant="outline">Défaut</Badge>
                        ) : (
                          <Badge variant={currentValue ? "default" : "destructive"}>
                            {String(currentValue).toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setOn(k)}
                        size="sm"
                        variant={currentValue === true ? "default" : "outline"}
                      >
                        ON
                      </Button>
                      <Button
                        onClick={() => setOff(k)}
                        size="sm"
                        variant={currentValue === false ? "destructive" : "outline"}
                      >
                        OFF
                      </Button>
                      <Button
                        onClick={() => reset(k)}
                        size="sm"
                        variant="ghost"
                        disabled={!isOverridden}
                      >
                        Reset
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Naviguer vers les pages affectées par les flags
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/modules/scores">
                Aller aux Scores actuels
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/modules/scores-v2">
                Aller aux Scores V2
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/modules/adaptive-music">
                Aller à la Musique Adaptative
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
