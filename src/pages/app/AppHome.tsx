import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Music, Brain, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AppHome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenue dans votre espace bien-être
          </h1>
          <p className="text-xl text-muted-foreground">
            Découvrez nos modules pour améliorer votre bien-être mental
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/scan')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Scanner Émotionnel
              </CardTitle>
              <CardDescription>
                Analysez vos émotions en temps réel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Commencer l'analyse
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/music')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-6 w-6 text-primary" />
                Musique Thérapeutique
              </CardTitle>
              <CardDescription>
                Musique adaptée à votre état émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Écouter maintenant
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/coach')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                Coach IA
              </CardTitle>
              <CardDescription>
                Assistant personnel pour votre bien-être
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Démarrer une conversation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}