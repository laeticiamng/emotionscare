import { useAuth } from "@/contexts/AuthContext";
import { useFlags } from "@/core/flags";
import { AsyncState, CopyBadge } from "@/components/transverse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, MessageCircle, Coffee, Plus } from "lucide-react";

export default function CollabPage() {
  const { user } = useAuth();
  const flags = useFlags();
  const navigate = useNavigate();

  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Espace Collaboration
          </h1>
          <p className="text-muted-foreground">
            Votre bien-être en équipe
          </p>
        </div>

        <AsyncState.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Social Cocon */}
            <Card className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => navigate('/app/social-cocon')}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <CardTitle>Social Cocon</CardTitle>
                </div>
                <CardDescription>
                  Espaces d'écoute bienveillante entre collègues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CopyBadge kind="durée" idx={1} />
              </CardContent>
            </Card>

            {/* Communauté (si feature flag activé) */}
            {flags.has('FF_COMMUNITY') && (
              <Card className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate('/app/community')}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-primary" />
                    <CardTitle>Communauté</CardTitle>
                  </div>
                  <CardDescription>
                    Partage et soutien mutuel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CopyBadge kind="progression" idx={1} />
                </CardContent>
              </Card>
            )}

            {/* Créer une équipe */}
            <Card className="cursor-pointer hover:shadow-lg transition-all border-dashed"
                  onClick={() => navigate('/app/teams')}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                  <CardTitle className="text-muted-foreground">Créer une équipe</CardTitle>
                </div>
                <CardDescription>
                  Invitez vos collègues pour des moments bien-être
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle équipe
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Accès aux modules personnels */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Votre bien-être personnel</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate('/app/home')}>
                Retour à mon cocon
              </Button>
              <Button variant="ghost" onClick={() => navigate('/app/journal')}>
                Journal personnel
              </Button>
              <Button variant="ghost" onClick={() => navigate('/app/scan')}>
                Mesure émotionnelle
              </Button>
              <Button variant="ghost" onClick={() => navigate('/app/activity')}>
                Mon activité
              </Button>
            </div>
          </div>
        </AsyncState.Content>
      </div>
    </main>
  );
}