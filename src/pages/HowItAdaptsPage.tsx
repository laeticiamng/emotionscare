// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, TrendingUp } from 'lucide-react';

export default function HowItAdaptsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Comment on adapte l'app à ton ressenti ?</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Adaptation sans questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              L'app observe tes micro-interactions naturelles (choix d'ambiance, durée d'écoute, 
              gestes, répétitions, etc.) pour adapter progressivement l'expérience à ton état émotionnel, 
              <strong> sans jamais te poser de questions explicites ni afficher de scores chiffrés</strong>.
            </p>
            <p className="text-muted-foreground">
              Nous utilisons des signaux implicites issus de ta navigation : préférence pour les modules 
              calmes vs énergisants, temps passé sur chaque exercice, choix de presets, etc.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Exemples de signaux captés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h3 className="font-semibold">🏠 Tableau de bord</h3>
              <p className="text-sm text-muted-foreground">
                Réordonner les cartes, choisir "Lancer maintenant" vs "Plus tard", 
                temps passé sur chaque module → nous indique tes centres d'intérêt et ton énergie.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">🎵 Musique</h3>
              <p className="text-sm text-muted-foreground">
                Choix de preset (calme/énergisant), durée d'écoute, "Encore 2 min ?" → 
                nous adaptons les textures musicales et suggérons d'autres modules si besoin.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">🫁 Respiration</h3>
              <p className="text-sm text-muted-foreground">
                Respect de la cadence (ratio inspiration/expiration), choix silence vs guidage vocal → 
                nous ajustons les exercices proposés pour maximiser ton confort.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">📓 Journal</h3>
              <p className="text-sm text-muted-foreground">
                Choix de thème (gratitude, marche...), ajout de notes vocales, marqueur "journée lourde" → 
                nous orientons les résumés et suggestions vers ce qui t'aide le plus.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Éthique & RGPD
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                <strong>Opt-in clair</strong> : tu contrôles tout via le switch 
                "Personnalisation bien-être" dans les Paramètres.
              </li>
              <li>
                <strong>Pas de biométrie</strong> : aucune analyse vocale ou vidéo 
                sans consentement spécifique séparé.
              </li>
              <li>
                <strong>Anonymisation</strong> : les signaux ne contiennent aucune donnée 
                personnellement identifiable (PII).
              </li>
              <li>
                <strong>K-anonymat B2B</strong> : les agrégats côté entreprise ne sont visibles 
                que si au moins 5 personnes, sous forme textuelle uniquement.
              </li>
              <li>
                <strong>Verbal-only</strong> : l'app n'affiche jamais de score chiffré, 
                seulement des badges verbaux ("apaisé", "ça vient", "cap en vue"...).
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Contrôle total
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Tu peux désactiver la personnalisation à tout moment dans les Paramètres. 
              Aucun signal ne sera alors collecté ni envoyé.
            </p>
            <p className="text-muted-foreground">
              Toutes les données sont stockées de manière sécurisée et conforme au RGPD. 
              Tu peux demander leur suppression à tout moment.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button onClick={() => navigate('/app/settings')} size="lg">
            Gérer mes préférences
          </Button>
        </div>
      </div>
    </div>
  );
}
