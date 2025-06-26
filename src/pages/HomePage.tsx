
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Building2, Users, Music, Scan, MessageSquare, VrHeadset, BookOpen, Trophy, Shield, HelpCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center gap-4 mb-8">
            <Heart className="h-16 w-16 text-pink-500" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
            <Brain className="h-16 w-16 text-purple-500" />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La plateforme de bien-être émotionnel intelligente pour professionnels de santé et particuliers
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/choose-mode">
              <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                <Heart className="mr-2 h-5 w-5" />
                Commencer maintenant
              </Button>
            </Link>
            <Link to="/help-center">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                <HelpCircle className="mr-2 h-5 w-5" />
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Fonctionnalités</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Scan className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle>Scan Émotionnel</CardTitle>
                <CardDescription>Analysez vos émotions en temps réel</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Music className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle>Musicothérapie</CardTitle>
                <CardDescription>Musique adaptative pour votre bien-être</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-purple-500 mb-4" />
                <CardTitle>Coach IA</CardTitle>
                <CardDescription>Accompagnement personnalisé 24/7</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <VrHeadset className="h-12 w-12 text-indigo-500 mb-4" />
                <CardTitle>Réalité Virtuelle</CardTitle>
                <CardDescription>Expériences immersives de relaxation</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-amber-500 mb-4" />
                <CardTitle>Journal Émotionnel</CardTitle>
                <CardDescription>Suivez votre progression quotidienne</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Trophy className="h-12 w-12 text-orange-500 mb-4" />
                <CardTitle>Gamification</CardTitle>
                <CardDescription>Badges et récompenses motivantes</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Choisissez votre espace</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all">
              <CardHeader>
                <Heart className="h-12 w-12 text-pink-200 mb-4 mx-auto" />
                <CardTitle className="text-white">Espace Personnel</CardTitle>
                <CardDescription className="text-pink-100">
                  Pour les particuliers et professionnels de santé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/b2c/login">
                  <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
                    Accéder à mon espace
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all">
              <CardHeader>
                <Building2 className="h-12 w-12 text-blue-200 mb-4 mx-auto" />
                <CardTitle className="text-white">Espace Entreprise</CardTitle>
                <CardDescription className="text-pink-100">
                  Solutions B2B pour organisations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/b2b/selection">
                  <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
                    Découvrir nos solutions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
