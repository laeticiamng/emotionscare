import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Brain, Music, BookOpen, Headphones, BarChart3, Users, Wind } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  const modules = [
    {
      title: 'Scanner Émotionnel',
      description: 'Analysez vos émotions en temps réel avec notre technologie avancée',
      icon: Heart,
      href: '/scan',
      gradient: 'from-blue-500 to-purple-500',
      hoverGradient: 'from-blue-600 to-purple-600',
      iconColor: 'text-red-500'
    },
    {
      title: 'Musique Thérapeutique',
      description: 'Musique personnalisée adaptée à votre état émotionnel',
      icon: Music,
      href: '/music',
      gradient: 'from-green-500 to-teal-500',
      hoverGradient: 'from-green-600 to-teal-600',
      iconColor: 'text-green-500'
    },
    {
      title: 'Coach IA',
      description: 'Votre assistant personnel pour améliorer votre bien-être',
      icon: Brain,
      href: '/coach',
      gradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'from-purple-600 to-pink-600',
      iconColor: 'text-purple-500'
    },
    {
      title: 'Journal Émotionnel',
      description: 'Suivez votre parcours émotionnel quotidien',
      icon: BookOpen,
      href: '/journal',
      gradient: 'from-violet-500 to-purple-500',
      hoverGradient: 'from-violet-600 to-purple-600',
      iconColor: 'text-violet-500'
    },
    {
      title: 'Réalité Virtuelle',
      description: 'Immersion thérapeutique en environnements apaisants',
      icon: Headphones,
      href: '/vr',
      gradient: 'from-indigo-500 to-purple-500',
      hoverGradient: 'from-indigo-600 to-purple-600',
      iconColor: 'text-indigo-500'
    },
    {
      title: 'Analytics RH',
      description: 'Tableau de bord pour managers et RH',
      icon: BarChart3,
      href: '/analytics',
      gradient: 'from-orange-500 to-red-500',
      hoverGradient: 'from-orange-600 to-red-600',
      iconColor: 'text-orange-500'
    },
    {
      title: 'Communauté',
      description: 'Connectez-vous avec d\'autres utilisateurs',
      icon: Users,
      href: '/social',
      gradient: 'from-emerald-500 to-teal-500',
      hoverGradient: 'from-emerald-600 to-teal-600',
      iconColor: 'text-emerald-500'
    },
    {
      title: 'Exercices de Respiration',
      description: 'Techniques de respiration guidées',
      icon: Wind,
      href: '/breathwork',
      gradient: 'from-sky-500 to-blue-500',
      hoverGradient: 'from-sky-600 to-blue-600',
      iconColor: 'text-sky-500'
    }
  ]

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

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16" role="main">
          {modules.map((module, index) => {
            const IconComponent = module.icon
            return (
              <Card 
                key={index}
                className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
                role="article" 
                aria-labelledby={`module-${index}-title`}
              >
                <CardHeader>
                  <CardTitle id={`module-${index}-title`} className="flex items-center gap-3 text-lg">
                    <IconComponent className={`h-6 w-6 ${module.iconColor}`} aria-hidden="true" />
                    {module.title}
                  </CardTitle>
                  <CardDescription>
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate(module.href)} 
                    className={`w-full bg-gradient-to-r ${module.gradient} hover:${module.hoverGradient} text-white`}
                    aria-label={`Accéder au module ${module.title}`}
                  >
                    Découvrir
                  </Button>
                </CardContent>
              </Card>
            )
          })}
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