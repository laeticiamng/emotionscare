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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Scanner Émotionnel</h1>
          <p className="text-lg text-muted-foreground">
            Analysez votre état émotionnel en temps réel
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Analyse en cours
            </CardTitle>
            <CardDescription>
              Restez calme et détendu pendant l'analyse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isScanning && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  Analyse en cours... {progress}%
                </p>
              </div>
            )}
            
            {!isScanning && progress === 0 && (
              <Button onClick={startScan} className="w-full" size="lg">
                Commencer l'analyse
              </Button>
            )}

            {!isScanning && progress === 100 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="flex items-center gap-2 pt-6">
                    <Heart className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="font-semibold">Calme</p>
                      <p className="text-sm text-muted-foreground">85%</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="flex items-center gap-2 pt-6">
                    <Smile className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-semibold">Joie</p>
                      <p className="text-sm text-muted-foreground">72%</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="flex items-center gap-2 pt-6">
                    <Brain className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-semibold">Focus</p>
                      <p className="text-sm text-muted-foreground">68%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}