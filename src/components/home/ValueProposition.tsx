import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';
import { withLandingUtm } from '@/lib/utm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Activity, Brain, BarChart3 } from 'lucide-react';

const ValueProposition: React.FC = () => {
  return (
    <section className="py-12 px-4 md:px-0">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Notre approche innovante</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          EmotionsCare propose une solution complète pour améliorer le bien-être émotionnel en entreprise, en utilisant les dernières avancées en intelligence artificielle et en neurosciences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6 bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/40 dark:to-blue-900/20 border-blue-100 dark:border-blue-900">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center mb-4">
            <Brain className="h-6 w-6 text-blue-700 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">IA émotionnelle</h3>
          <p className="text-muted-foreground mb-4">
            Notre technologie d'analyse avancée détecte les émotions à partir de la voix et du texte pour fournir des insights personnalisés.
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center text-sm">
              <span className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-blue-700 dark:text-blue-400 text-xs">✓</span>
              Analyse vocale en temps réel
            </li>
            <li className="flex items-center text-sm">
              <span className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-blue-700 dark:text-blue-400 text-xs">✓</span>
              Détection d'émotions nuancées
            </li>
            <li className="flex items-center text-sm">
              <span className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-blue-700 dark:text-blue-400 text-xs">✓</span>
              Feedback en temps réel
            </li>
          </ul>
          <Button asChild variant="ghost" className="w-full">
            <Link to={withLandingUtm(routes.b2c.scan())}>Explorer</Link>
          </Button>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-white to-purple-50 dark:from-purple-950/40 dark:to-purple-900/20 border-purple-100 dark:border-purple-900">
          <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 w-12 h-12 flex items-center justify-center mb-4">
            <Activity className="h-6 w-6 text-purple-700 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Thérapie adaptative</h3>
          <p className="text-muted-foreground mb-4">
            Des thérapies musicales et immersives personnalisées selon votre état émotionnel pour améliorer votre bien-être quotidien.
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center text-sm">
              <span className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-purple-700 dark:text-purple-400 text-xs">✓</span>
              Musique thérapeutique adaptée
            </li>
            <li className="flex items-center text-sm">
              <span className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-purple-700 dark:text-purple-400 text-xs">✓</span>
              Expériences immersives VR
            </li>
            <li className="flex items-center text-sm">
              <span className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-purple-700 dark:text-purple-400 text-xs">✓</span>
              Exercices de pleine conscience
            </li>
          </ul>
          <Button asChild variant="ghost" className="w-full">
            <Link to={withLandingUtm(routes.b2c.music())}>Découvrir</Link>
          </Button>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-white to-amber-50 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-100 dark:border-amber-900">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 w-12 h-12 flex items-center justify-center mb-4">
            <BarChart3 className="h-6 w-6 text-amber-700 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Analyses pour entreprises</h3>
          <p className="text-muted-foreground mb-4">
            Des indicateurs clefs pour les managers afin d'évaluer et d'améliorer le climat émotionnel de leurs équipes.
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center text-sm">
              <span className="bg-amber-100 dark:bg-amber-900/30 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-amber-700 dark:text-amber-400 text-xs">✓</span>
              Tableau de bord analytique
            </li>
            <li className="flex items-center text-sm">
              <span className="bg-amber-100 dark:bg-amber-900/30 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-amber-700 dark:text-amber-400 text-xs">✓</span>
              Suivi des tendances émotionnelles
            </li>
            <li className="flex items-center text-sm">
              <span className="bg-amber-100 dark:bg-amber-900/30 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-amber-700 dark:text-amber-400 text-xs">✓</span>
              Anonymisation des données
            </li>
          </ul>
          <Button asChild variant="ghost" className="w-full">
            <Link to={withLandingUtm(routes.b2c.dashboard())}>En savoir plus</Link>
          </Button>
        </Card>
      </div>
      
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Sécurité et confidentialité</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl mx-auto">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-medium">Données cryptées</h4>
              <p className="text-sm text-muted-foreground">Protection de vos informations sensibles</p>
            </div>
          </div>
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-medium">RGPD conforme</h4>
              <p className="text-sm text-muted-foreground">Respect des normes européennes</p>
            </div>
          </div>
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-medium">Anonymisation</h4>
              <p className="text-sm text-muted-foreground">Protection de votre identité</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
