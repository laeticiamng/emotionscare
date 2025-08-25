import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search, Heart, Sparkles } from 'lucide-react';

export default function NotFoundPageTemp() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 max-w-md mx-auto"
      >
        {/* Illustration animée */}
        <motion.div 
          className="relative mx-auto w-32 h-32"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center relative overflow-hidden">
            <Heart className="h-12 w-12 text-primary/60" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
              animate={{ x: [-100, 200] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
          
          {/* Particules flottantes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -50, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </motion.div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">
              404 - Page introuvable
            </CardTitle>
            <CardDescription className="text-lg">
              Oops ! Cette page semble s'être échappée de notre dimension thérapeutique.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                La page que vous recherchez n'existe plus ou a été déplacée.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Mais ne vous inquiétez pas, votre bien-être nous tient à cœur !</span>
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Page précédente
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-3">Suggestions pour vous :</h3>
              <div className="grid grid-cols-1 gap-2">
                <Link 
                  to="/scan" 
                  className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="font-medium">Scan émotionnel</div>
                  <div className="text-sm text-muted-foreground">Analysez votre état actuel</div>
                </Link>
                <Link 
                  to="/music" 
                  className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="font-medium">Musicothérapie</div>
                  <div className="text-sm text-muted-foreground">Détendez-vous avec notre IA</div>
                </Link>
                <Link 
                  to="/breathwork" 
                  className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="font-medium">Exercices respiratoires</div>
                  <div className="text-sm text-muted-foreground">Retrouvez votre calme</div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}