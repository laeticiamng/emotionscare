import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Brain, Heart, Smile } from 'lucide-react'

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)

  const startScan = () => {
    setIsScanning(true)
    setProgress(0)
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsScanning(false)
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Scanner Émotionnel</h1>
          <p className="text-lg text-muted-foreground">
            Analysez votre état émotionnel en temps réel
          </p>
        </header>

        <main role="main">
          <Card className="mb-8" role="region" aria-labelledby="scan-controls">
            <CardHeader>
              <CardTitle id="scan-controls" className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" aria-hidden="true" />
                Analyse en cours
              </CardTitle>
              <CardDescription>
                Restez calme et détendu pendant l'analyse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isScanning && (
                <div className="space-y-2" role="status" aria-live="polite">
                  <Progress value={progress} className="w-full" aria-label={`Progression de l'analyse: ${progress}%`} />
                  <p className="text-sm text-muted-foreground text-center">
                    Analyse en cours... {progress}%
                  </p>
                </div>
              )}
              
              {!isScanning && progress === 0 && (
                <Button 
                  onClick={startScan} 
                  className="w-full" 
                  size="lg"
                  aria-label="Démarrer l'analyse émotionnelle"
                >
                  Commencer l'analyse
                </Button>
              )}

              {!isScanning && progress === 100 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="region" aria-labelledby="results-title">
                  <h2 id="results-title" className="sr-only">Résultats de l'analyse émotionnelle</h2>
                  
                  <Card role="article" aria-labelledby="calm-result">
                    <CardContent className="flex items-center gap-2 pt-6">
                      <Heart className="h-8 w-8 text-red-500" aria-hidden="true" />
                      <div>
                        <p id="calm-result" className="font-semibold">Calme</p>
                        <p className="text-sm text-muted-foreground" aria-label="Niveau de calme: 85 pourcent">85%</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card role="article" aria-labelledby="joy-result">
                    <CardContent className="flex items-center gap-2 pt-6">
                      <Smile className="h-8 w-8 text-green-500" aria-hidden="true" />
                      <div>
                        <p id="joy-result" className="font-semibold">Joie</p>
                        <p className="text-sm text-muted-foreground" aria-label="Niveau de joie: 72 pourcent">72%</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card role="article" aria-labelledby="focus-result">
                    <CardContent className="flex items-center gap-2 pt-6">
                      <Brain className="h-8 w-8 text-blue-500" aria-hidden="true" />
                      <div>
                        <p id="focus-result" className="font-semibold">Focus</p>
                        <p className="text-sm text-muted-foreground" aria-label="Niveau de focus: 68 pourcent">68%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}