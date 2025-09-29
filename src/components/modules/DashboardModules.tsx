import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Music, MessageCircle, Activity, Camera, Gamepad2 } from 'lucide-react'

const modules = [
  { 
    id: 'scan', 
    title: 'Scan émotionnel', 
    description: 'Auto-évaluation rapide de votre état émotionnel',
    icon: Brain,
    path: '/scan',
    instrument: 'SAM'
  },
  { 
    id: 'music', 
    title: 'Thérapie musicale', 
    description: 'Musique adaptée à votre humeur',
    icon: Music,
    path: '/music',
    instrument: 'POMS_SF'
  },
  { 
    id: 'coach', 
    title: 'Coach IA', 
    description: 'Accompagnement personnalisé',
    icon: MessageCircle,
    path: '/coach',
    instrument: 'AAQ2'
  },
  { 
    id: 'breathwork', 
    title: 'Respiration guidée', 
    description: 'Exercices de respiration thérapeutique',
    icon: Activity,
    path: '/breathwork',
    instrument: 'STAI6'
  }
]

const DashboardModules: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Vos modules de bien-être</h2>
        <p className="text-muted-foreground">
          Outils personnalisés pour votre équilibre émotionnel
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </div>
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.location.href = module.path}
                >
                  Commencer
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default DashboardModules