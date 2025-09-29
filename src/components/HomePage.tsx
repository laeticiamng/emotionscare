import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Brain, Music } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            EmotionsCare
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Votre plateforme d'intelligence émotionnelle pour le bien-être personnel et professionnel
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16" role="main">
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" role="article" aria-labelledby="scan-title">
            <CardHeader>
              <CardTitle id="scan-title" className="flex items-center gap-3 text-lg">
                <Heart className="h-6 w-6 text-red-500" aria-hidden="true" />
                Scanner Émotionnel
              </CardTitle>
              <CardDescription>
                Analysez vos émotions en temps réel avec notre technologie avancée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/scan')} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                aria-label="Accéder au scanner émotionnel"
              >
                Commencer l'analyse
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" role="article" aria-labelledby="music-title">
            <CardHeader>
              <CardTitle id="music-title" className="flex items-center gap-3 text-lg">
                <Music className="h-6 w-6 text-green-500" aria-hidden="true" />
                Musique Thérapeutique
              </CardTitle>
              <CardDescription>
                Musique personnalisée adaptée à votre état émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/music')} 
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                aria-label="Accéder à la musique thérapeutique"
              >
                Écouter maintenant
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" role="article" aria-labelledby="coach-title">
            <CardHeader>
              <CardTitle id="coach-title" className="flex items-center gap-3 text-lg">
                <Brain className="h-6 w-6 text-purple-500" aria-hidden="true" />
                Coach IA
              </CardTitle>
              <CardDescription>
                Votre assistant personnel pour améliorer votre bien-être
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/coach')} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                aria-label="Accéder au coach IA"
              >
                Parler au coach
              </Button>
            </CardContent>
          </Card>
        </main>

        <nav className="text-center" role="navigation" aria-label="Navigation principale">
          <Button 
            onClick={() => navigate('/app')} 
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
            aria-label="Accéder à l'application complète EmotionsCare"
          >
            Accéder à l'application complète
          </Button>
        </nav>
      </div>
    </div>
  )
}