// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Heart, Shield, Music, Smile, Activity } from 'lucide-react';

const SimpleB2CPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm" role="banner">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" aria-hidden="true" />
            <span className="text-2xl font-bold text-foreground">EmotionsCare</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/login">
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link to="/signup">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {/* Hero */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Prenez soin de votre bien-être émotionnel
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Plateforme de régulation émotionnelle conçue pour les étudiants en santé et les soignants.
              Exercices de 3 minutes, 100 % confidentiel.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/signup">
                <Button size="lg" className="px-8">Commencer gratuitement</Button>
              </Link>
              <Link to="/entreprise">
                <Button size="lg" variant="outline" className="px-8">Solutions entreprise</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Nos fonctionnalités
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Brain, title: 'Scan émotionnel IA', desc: 'Évaluez votre état émotionnel en quelques questions grâce à l\'intelligence artificielle.' },
                { icon: Music, title: 'Musicothérapie', desc: 'Fréquences binaurales et ambiances sonores adaptées à votre état émotionnel.' },
                { icon: Shield, title: 'Confidentialité RGPD', desc: 'Vos données sont chiffrées et restent entièrement privées.' },
                { icon: Smile, title: 'Coach IA 24h/24', desc: 'Accompagnement bienveillant adapté aux professionnels de santé.' },
                { icon: Activity, title: 'Suivi de progression', desc: 'Métriques détaillées et tendances hebdomadaires de votre bien-être.' },
                { icon: Heart, title: 'Respiration guidée', desc: 'Exercices de respiration et relaxation en 3 minutes.' },
              ].map((f) => (
                <Card key={f.title} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <f.icon className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
                    <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                    <p className="text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Prêt à prendre soin de vous ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez EmotionsCare et découvrez des outils conçus pour votre bien-être.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="px-8">
                Créer mon compte gratuit
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SimpleB2CPage;
