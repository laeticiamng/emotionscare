import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, BrainCircuit, HeartHandshake, Music2 } from 'lucide-react';
import MusicGenerationTest from '@/components/music/MusicGenerationTest';

export default function HomePage() {
  const features = [
    {
      title: 'Analyse émotionnelle',
      description: 'Comprenez vos émotions grâce à notre IA avancée.',
      icon: BrainCircuit,
    },
    {
      title: 'Musique personnalisée',
      description: 'Laissez la musique vous accompagner selon votre humeur.',
      icon: Music2,
    },
    {
      title: 'Communauté de soutien',
      description: 'Partagez et échangez avec une communauté bienveillante.',
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" data-testid="home-page">
      <header className="bg-white shadow-md">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-800">EmotionsCare</h1>
          <p className="text-gray-600 mt-2">Votre allié pour le bien-être émotionnel.</p>
        </div>
      </header>
      
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-primary mb-6">Découvrez une nouvelle façon de prendre soin de vous</h2>
          <p className="text-lg text-gray-700 mb-8">
            EmotionsCare vous offre des outils personnalisés pour explorer, comprendre et gérer vos émotions au quotidien.
          </p>
          <Link to="/choose-mode">
            <Button size="lg">
              Commencer l'exploration <Rocket className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenue sur EmotionsCare</CardTitle>
              <CardDescription>Votre espace personnel pour l'épanouissement émotionnel.</CardDescription>
            </CardHeader>
            <CardContent>
              Explorez nos outils et découvrez comment EmotionsCare peut vous aider à mieux gérer vos émotions et à améliorer votre bien-être général.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Accédez directement à vos fonctionnalités préférées.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button asChild>
                <Link to="/scan">Effectuer une analyse émotionnelle</Link>
              </Button>
              <Button asChild>
                <Link to="/journal">Écrire dans votre journal</Link>
              </Button>
              <Button asChild>
                <Link to="/music">Explorer la musique adaptée</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Test de génération musicale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Test de génération musicale</h2>
          <MusicGenerationTest />
        </section>

        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">Nos fonctionnalités clés</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
