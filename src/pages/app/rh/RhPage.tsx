import { useAuth } from "@/contexts/AuthContext";
import { useFlags } from "@/core/flags";
import { AsyncState, CopyBadge } from "@/components/transverse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  FileText, 
  Calendar, 
  Settings, 
  Shield, 
  Eye,
  Accessibility,
  Users
} from "lucide-react";

export default function RhPage() {
  const { user } = useAuth();
  const flags = useFlags();
  const navigate = useNavigate();

  // Vérification du flag manager
  if (!flags.has('FF_MANAGER_DASH')) {
    return (
      <main data-testid="page-root" className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Accès restreint</h1>
          <p className="text-muted-foreground mb-6">
            Les outils RH ne sont pas encore disponibles.
          </p>
          <Button onClick={() => navigate('/app/home')}>
            Retour à l'accueil
          </Button>
        </div>
      </main>
    );
  }

  const managerTools = [
    {
      title: "Heatmap",
      description: "Vue d'ensemble bien-être équipe (min 5 personnes)",
      icon: BarChart3,
      path: "/app/rh", // Stays on same page with heatmap
      action: "view_heatmap"
    },
    {
      title: "Reports", 
      description: "Rapports agrégés et exports sécurisés",
      icon: FileText,
      path: "/app/reports",
      action: "generate"
    },
    {
      title: "Planifier une pause",
      description: "Organiser des moments d'équipe",
      icon: Calendar,
      path: "/app/events", 
      action: "schedule"
    },
    {
      title: "Optimisation",
      description: "Suggestions d'amélioration non intrusives",
      icon: Settings,
      path: "/app/optimization",
      action: "optimize"
    },
    {
      title: "Sécurité",
      description: "Gestion des sessions et membres",
      icon: Shield,
      path: "/app/security",
      action: "manage"
    },
    {
      title: "Audit",
      description: "Journal des actions (anonymisé)",
      icon: Eye,
      path: "/app/audit",
      action: "review" 
    },
    {
      title: "Accessibilité",
      description: "Conformité et outils d'inclusion",
      icon: Accessibility,
      path: "/app/accessibility",
      action: "check"
    }
  ];

  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard RH
          </h1>
          <p className="text-muted-foreground">
            Outils de pilotage bienveillant pour votre équipe
          </p>
        </div>

        <AsyncState.Content>
          {/* Heatmap preview (placeholder) */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <CardTitle>Vue d'ensemble équipe</CardTitle>
                </div>
                <CopyBadge kind="progression" idx={2} />
              </div>
              <CardDescription>
                Données agrégées (minimum 5 personnes pour préserver l'anonymat)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {/* Simulation heatmap avec cellules masquées si <5 */}
                {Array.from({ length: 28 }, (_, i) => (
                  <div 
                    key={i}
                    className={`h-8 rounded ${
                      i % 5 === 0 ? 'bg-muted text-muted-foreground text-xs flex items-center justify-center' : 
                      i % 3 === 0 ? 'bg-green-100' : 
                      i % 7 === 0 ? 'bg-orange-100' : 'bg-blue-100'
                    }`}
                  >
                    {i % 5 === 0 ? '<5' : ''}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Les cellules grisées indiquent un échantillon insuffisant (protection de l'anonymat)
              </p>
            </CardContent>
          </Card>

          {/* Outils RH */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {managerTools.map((tool) => (
              <Card 
                key={tool.path}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(tool.path)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <tool.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {tool.action === 'view_heatmap' && 'Voir détails'}
                    {tool.action === 'generate' && 'Générer'}  
                    {tool.action === 'schedule' && 'Planifier'}
                    {tool.action === 'optimize' && 'Analyser'}
                    {tool.action === 'manage' && 'Gérer'}
                    {tool.action === 'review' && 'Consulter'}
                    {tool.action === 'check' && 'Vérifier'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Accès personnel (car un manager est aussi un humain) */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Votre bien-être personnel</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate('/app/home')}>
                Mon cocon personnel
              </Button>
              <Button variant="ghost" onClick={() => navigate('/app/collab')}>
                Espace collaboration
              </Button>
            </div>
          </div>
        </AsyncState.Content>
      </div>
    </main>
  );
}