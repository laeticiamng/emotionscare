/**
 * HomeB2CPage - Landing page B2C
 * TICKET: FE/BE-Router-Cleanup-01
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Routes } from '@/routerV2/helpers';
import { Heart, Brain, Smile, Zap, Users, Star } from 'lucide-react';

const HomeB2CPage: React.FC = () => {
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
            <Link to={Routes.login({ segment: 'b2c' })}>
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link to={Routes.signup({ segment: 'b2c' })}>
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
            <Link to={Routes.signup({ segment: 'b2c' })}>
              <Button size="lg" className="px-8">
                Commencer gratuitement
              </Button>
            </Link>
            <Link to={Routes.b2bLanding()}>
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
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Scan émotionnel IA</h3>
                <p className="text-gray-600">
                  Analysez vos émotions en temps réel grâce à notre intelligence artificielle
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Smile className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Modules Fun-First</h3>
                <p className="text-gray-600">
                  Des expériences ludiques et immersives pour améliorer votre humeur
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Coach personnel IA</h3>
                <p className="text-gray-600">
                  Un accompagnement personnalisé pour votre développement personnel
                </p>
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
          <Link to={Routes.signup({ segment: 'b2c' })}>
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
                <li><Link to={Routes.about()} className="hover:text-white">À propos</Link></li>
                <li><Link to={Routes.contact()} className="hover:text-white">Contact</Link></li>
                <li><Link to={Routes.help()} className="hover:text-white">Aide</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to={Routes.b2cLanding()} className="hover:text-white">Particuliers</Link></li>
                <li><Link to={Routes.b2bLanding()} className="hover:text-white">Entreprises</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Compte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to={Routes.login()} className="hover:text-white">Connexion</Link></li>
                <li><Link to={Routes.signup()} className="hover:text-white">Inscription</Link></li>
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

export default HomeB2CPage;