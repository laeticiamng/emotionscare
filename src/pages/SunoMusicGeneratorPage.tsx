/**
 * Suno Music Generator Demo Page
 * Complete music generation interface with Suno AI
 * Uses Edge Functions - no API keys needed on client side
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SunoMusicGenerator } from '@/components/music/SunoMusicGenerator';
import { Music, Sparkles, Info, Zap, Heart, Clock } from 'lucide-react';

export default function SunoMusicGeneratorPage() {
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg">
          <Music className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Générateur Musical Suno AI
            <Badge className="ml-2" variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              Bêta
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Créez de la musique thérapeutique personnalisée en quelques clics grâce à l'intelligence artificielle
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Comment ça fonctionne ?
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>
                  <strong>Sélectionnez votre humeur :</strong> Choisissez l'émotion que vous ressentez ou celle que vous souhaitez atteindre
                </li>
                <li>
                  <strong>Personnalisez les paramètres :</strong> Genre musical, tempo, niveau d'énergie, instrumental ou avec paroles
                </li>
                <li>
                  <strong>Générez votre musique :</strong> L'IA crée une composition unique en 30-60 secondes
                </li>
                <li>
                  <strong>Écoutez et sauvegardez :</strong> Profitez de votre musique personnalisée et ajoutez-la à vos favoris
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Generator */}
      <SunoMusicGenerator />

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-yellow-500" />
              Génération Rapide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Obtenez votre musique personnalisée en moins d'une minute. L'IA Suno analyse vos
              paramètres et crée une composition unique adaptée à vos besoins.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-red-500" />
              Thérapeutiquement Adapté
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chaque morceau est conçu pour soutenir votre bien-être émotionnel. Les paramètres
              musicaux sont optimisés selon les principes de musicothérapie.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Créations Uniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chaque génération produit une composition musicale originale. Aucune limite de
              créativité - créez autant de morceaux que vous le souhaitez.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Cas d'utilisation</CardTitle>
          <CardDescription>
            Découvrez comment utiliser la musique générée par IA dans votre quotidien
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Gestion du stress
              </h3>
              <p className="text-sm text-muted-foreground">
                Créez de la musique apaisante pour réduire l'anxiété et favoriser la relaxation
                après une journée stressante. Parfait pour les pauses ou avant le coucher.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Boost de productivité
              </h3>
              <p className="text-sm text-muted-foreground">
                Générez de la musique concentrée et énergisante pour améliorer votre focus pendant
                le travail ou l'étude. Idéal pour les sessions de deep work.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Méditation et mindfulness
              </h3>
              <p className="text-sm text-muted-foreground">
                Accompagnez vos pratiques méditatives avec des compositions méditatives personnalisées.
                Crée l'ambiance parfaite pour la pleine conscience.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Music className="h-4 w-4 text-primary" />
                Régulation émotionnelle
              </h3>
              <p className="text-sm text-muted-foreground">
                Utilisez la musique pour influencer positivement votre humeur. Transition douce
                d'un état émotionnel à un autre grâce à des compositions adaptées.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-lg">Détails Techniques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            ✓ Modèle Suno v3.5 - Dernière génération d'IA musicale
          </p>
          <p>
            ✓ Support de 8 genres musicaux majeurs (Ambient, Lo-Fi, Classical, Jazz, etc.)
          </p>
          <p>
            ✓ 6 humeurs thérapeutiques prédéfinies avec paramètres optimisés
          </p>
          <p>
            ✓ Contrôle granulaire : tempo, énergie, instrumental/vocal
          </p>
          <p>
            ✓ Génération en temps réel (~30-60 secondes par morceau)
          </p>
          <p>
            ✓ Qualité audio haute définition (320kbps)
          </p>
          <p>
            ✓ Téléchargement et sauvegarde dans votre bibliothèque personnelle
          </p>
          <p className="pt-2 border-t">
            Propulsé par{' '}
            <a
              href="https://suno.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Suno AI
            </a>{' '}
            - La plateforme de génération musicale la plus avancée
          </p>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Astuce :</strong> Pour des résultats optimaux, essayez différentes
            combinaisons de paramètres. Chaque génération est unique et peut produire des résultats
            surprenants !
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
