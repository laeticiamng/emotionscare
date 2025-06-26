
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Users, Shield, Zap, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative px-4 py-20 text-center">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center items-center gap-4 mb-8">
            <Heart className="h-12 w-12 text-blue-600" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
            <Brain className="h-12 w-12 text-indigo-600" />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto">
            La plateforme de bien-être émotionnel dédiée aux professionnels de santé
          </p>
          
          <p className="text-lg text-gray-700 mb-10 max-w-4xl mx-auto">
            Découvrez une solution complète avec IA Coach, scan émotionnel, musicothérapie et suivi personnalisé 
            pour prendre soin de votre santé mentale au quotidien.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/choose-mode">
              <Button size="lg" className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200">
                Commencer maintenant
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 hover:bg-blue-50">
              En savoir plus
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Professionnels accompagnés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction utilisateur</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Support disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils innovants conçus spécifiquement pour le bien-être des professionnels de santé
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>IA Coach Personnel</CardTitle>
                <CardDescription>
                  Assistant intelligent disponible 24/7 pour vous accompagner dans votre bien-être émotionnel
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Scan Émotionnel</CardTitle>
                <CardDescription>
                  Analyse en temps réel de votre état émotionnel via reconnaissance vocale et faciale
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Musicothérapie</CardTitle>
                <CardDescription>
                  Playlists adaptatives basées sur votre état émotionnel pour optimiser votre bien-être
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Social Cocon</CardTitle>
                <CardDescription>
                  Communauté bienveillante pour partager et échanger avec vos pairs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Sécurité & Confidentialité</CardTitle>
                <CardDescription>
                  Données chiffrées et conformité RGPD pour une sécurité maximale
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Gamification</CardTitle>
                <CardDescription>
                  Système de récompenses et défis pour maintenir votre motivation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Témoignages
            </h2>
            <p className="text-xl text-gray-600">
              Ce que disent nos utilisateurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "EmotionsCare m'a vraiment aidé à gérer mon stress quotidien. L'IA Coach est incroyablement intuitive."
                </p>
                <div className="font-semibold text-gray-900">Dr. Marie Dubois</div>
                <div className="text-sm text-gray-500">Médecin urgentiste</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "La communauté Social Cocon est fantastique. Je ne me sens plus seul dans mes difficultés."
                </p>
                <div className="font-semibold text-gray-900">Jean-Pierre Martin</div>
                <div className="text-sm text-gray-500">Infirmier</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Les analyses émotionnelles m'ont permis de mieux comprendre mes réactions et d'améliorer mon bien-être."
                </p>
                <div className="font-semibold text-gray-900">Dr. Sophie Laurent</div>
                <div className="text-sm text-gray-500">Psychiatre</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à améliorer votre bien-être ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers de professionnels de santé qui prennent soin d'eux avec EmotionsCare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/choose-mode">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100">
                Commencer gratuitement
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600">
              Découvrir les tarifs
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">EmotionsCare</span>
              </div>
              <p className="text-gray-400">
                Votre partenaire pour un bien-être émotionnel optimal
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/coach" className="hover:text-white">IA Coach</Link></li>
                <li><Link to="/scan" className="hover:text-white">Scan Émotionnel</Link></li>
                <li><Link to="/music" className="hover:text-white">Musicothérapie</Link></li>
                <li><Link to="/vr" className="hover:text-white">Réalité Virtuelle</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Communauté</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/social-cocon" className="hover:text-white">Social Cocon</Link></li>
                <li><Link to="/gamification" className="hover:text-white">Gamification</Link></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Forum</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><Link to="/preferences" className="hover:text-white">Confidentialité</Link></li>
                <li><a href="#" className="hover:text-white">Conditions</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EmotionsCare. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
