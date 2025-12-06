/**
 * Simple B2C Landing Page - Version Stable
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Music, Camera, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const SimpleB2CPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">EmotionsCare</span>
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

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Prenez soin de votre bien-être émotionnel
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Découvrez une approche innovante du bien-être mental avec nos outils 
            d'analyse émotionnelle, de méditation guidée et de coaching personnalisé.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg" className="px-8">
                Commencer gratuitement
              </Button>
            </Link>
            <Link to="/entreprise">
              <Button size="lg" variant="outline" className="px-8">
                Solutions entreprise
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nos fonctionnalités phares
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-6 w-6 text-primary mr-2" />
                  Scan émotionnel IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Analysez vos émotions en temps réel grâce à notre intelligence artificielle
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Music className="h-6 w-6 text-primary mr-2" />
                  Musique thérapeutique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Compositions personnalisées adaptées à votre état émotionnel
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-6 w-6 text-primary mr-2" />
                  Coach personnel IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Un accompagnement personnalisé pour votre développement personnel
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Ils nous font confiance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "EmotionsCare a transformé ma gestion du stress quotidien."
                </p>
                <div className="font-semibold">Sarah M.</div>
                <div className="text-sm text-gray-500">Cadre supérieure</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "L'analyse faciale en temps réel est impressionnante."
                </p>
                <div className="font-semibold">Marc D.</div>
                <div className="text-sm text-gray-500">Entrepreneur</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Un outil professionnel que j'utilise avec mes patients."
                </p>
                <div className="font-semibold">Lisa K.</div>
                <div className="text-sm text-gray-500">Psychologue</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à transformer votre bien-être ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="px-8">
              Créer mon compte gratuit
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6" />
                <span className="text-xl font-bold">EmotionsCare</span>
              </div>
              <p className="text-gray-400">
                La plateforme de référence pour le bien-être émotionnel
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">À propos</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/help" className="hover:text-white">Aide</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/b2c" className="hover:text-white">Particuliers</Link></li>
                <li><Link to="/entreprise" className="hover:text-white">Entreprises</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Compte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">Connexion</Link></li>
                <li><Link to="/signup" className="hover:text-white">Inscription</Link></li>
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

export default SimpleB2CPage;